import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Prisma } from '@prisma/client';
import { LandNormalizerService } from './normalizers/land-normalizer.service';
import {
  RawLandRow,
  NormalizedLandRecord,
  ImportResult,
  ImportRowError,
} from './dto/land-record.dto';
import { PrismaService } from '../prisma.service';

/** Expected Ukrainian column headers in the source file */
const REQUIRED_COLUMNS: (keyof RawLandRow)[] = [
  'Кадастровий номер',
  'koatuu',
  'Форма власності',
  'Площа, га',
  'Землекористувач',
];

const ALL_COLUMNS: (keyof RawLandRow)[] = [
  'Кадастровий номер',
  'koatuu',
  'Форма власності',
  'Цільове призначення',
  'Місцерозташування',
  'Вид с/г угідь',
  'Площа, га',
  'Усереднена нормативно грошова оцінка',
  'ЄДРПОУ землекористувача',
  'Землекористувач',
  'Частка володіння',
  'Дата державної реєстрації права власності',
  'Номер запису про право власності',
  'Орган, що здійснив державну реєстрацію права власності',
  'Тип',
  'Підтип',
];

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private readonly landNormalizer: LandNormalizerService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Main entry point. Accepts a Buffer (uploaded file bytes).
   * Returns a structured ImportResult with normalised records and error log.
   */
  async processLandXlsx(fileBuffer: Buffer): Promise<ImportResult> {
    const rawRows = this.parseXlsx(fileBuffer);

    const records: NormalizedLandRecord[] = [];
    const allErrors: ImportRowError[] = [];
    let skipped = 0;

    for (let i = 0; i < rawRows.length; i++) {
      const rowNumber = i + 2; // +1 for 0-index, +1 for header row
      const raw = rawRows[i];

      // Skip completely empty rows
      if (this.isEmptyRow(raw)) {
        skipped++;
        continue;
      }

      const { record, errors } = this.landNormalizer.normalizeRow(
        raw,
        rowNumber,
      );
      allErrors.push(...errors);

      // Only include records that have at minimum a cadastral number
      if (!record.cadastralNumber) {
        skipped++;
        allErrors.push({
          row: rowNumber,
          field: 'cadastralNumber',
          rawValue: raw['Кадастровий номер'],
          reason: 'Row skipped: missing or invalid cadastral number',
        });
        continue;
      }

      records.push(record);
    }

    await this.persistLandRecords(records);

    this.logger.log(
      `Import complete: ${records.length} imported, ${skipped} skipped, ${allErrors.length} field errors`,
    );

    return {
      total: rawRows.length,
      imported: records.length,
      skipped,
      errors: allErrors,
      records,
    };
  }

  // ─── XLSX parsing ─────────────────────────────────────────────────────────

  private parseXlsx(buffer: Buffer): RawLandRow[] {
    let workbook: XLSX.WorkBook;

    try {
      workbook = XLSX.read(buffer, {
        type: 'buffer',
        cellDates: true, // parse dates as JS Date objects
        cellNF: false,
        cellText: false,
      });
    } catch (e) {
      throw new BadRequestException(
        `Cannot read xlsx file: ${(e as Error).message}`,
      );
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new BadRequestException('xlsx file contains no sheets');
    }

    const sheet = workbook.Sheets[sheetName];

    // Convert to array of objects using first row as header
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null, // missing cells → null (not undefined)
      raw: false, // respect cellDates option; dates come as JS Date
      rawNumbers: true, // keep numeric precision
    });

    if (rows.length === 0) {
      throw new BadRequestException('xlsx sheet is empty');
    }

    // Validate that required columns exist
    const firstRow = rows[0];
    const missingColumns = REQUIRED_COLUMNS.filter((col) => !(col in firstRow));
    if (missingColumns.length > 0) {
      throw new BadRequestException(
        `Missing required columns: ${missingColumns.join(', ')}`,
      );
    }

    // Re-map to strongly typed RawLandRow, filling absent optional columns with null
    return rows.map((row) => {
      const typed = {} as RawLandRow;
      for (const col of ALL_COLUMNS) {
        typed[col] = col in row ? row[col] : null;
      }
      return typed;
    });
  }

  private isEmptyRow(row: RawLandRow): boolean {
    return ALL_COLUMNS.every((col) => {
      const v = row[col];
      return v === null || v === undefined || String(v).trim() === '';
    });
  }

  private async persistLandRecords(
    records: NormalizedLandRecord[],
  ): Promise<void> {
    for (const record of records) {
      if (!record.cadastralNumber || !record.edrpou) {
        continue;
      }

      await this.prisma.landRecord.upsert({
        where: { cadastralNumber: record.cadastralNumber },
        create: this.toLandRecordInput(record),
        update: this.toLandRecordInput(record),
      });
    }
  }

  private toLandRecordInput(record: NormalizedLandRecord) {
    return {
      cadastralNumber: record.cadastralNumber as string,
      koatuu: record.koatuu,
      ownershipForm: record.ownershipForm,
      purpose: record.targetPurpose,
      location: record.location,
      agriLandType: record.landType,
      areaHa: record.areaHa,
      valuation:
        record.monetaryValuation === null
          ? null
          : new Prisma.Decimal(record.monetaryValuation),
      taxNumber: record.edrpou as string,
      ownerName: record.landUser,
      ownershipShare:
        record.ownershipShare === null
          ? null
          : record.ownershipShare.toString(),
      registrationDate: this.toUtcDate(record.registrationDate),
      recordNumber: record.recordNumber,
      registrarOrgan: record.registrarAuthority,
      docType: record.documentType,
      docSubtype: record.documentSubtype,
    };
  }

  private toUtcDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    return new Date(`${value}T00:00:00.000Z`);
  }
}
