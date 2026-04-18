import { Injectable, Logger } from '@nestjs/common';
import {
  RawLandRow,
  NormalizedLandRecord,
  ImportRowError,
} from '../dto/land-record.dto';

/**
 * Cadastral number format: XXXXXXXXXX:XX:XXX:XXXX
 * 10 digits : 2 digits : 3 digits : 4 digits
 */
const CADASTRAL_RE = /^\d{10}:\d{2}:\d{3}:\d{4}$/;

/**
 * KOATUU: exactly 10 digits.
 * Raw values come as floats (e.g. 4624884200.0) — we convert to int string.
 */
const KOATUU_RE = /^\d{10}$/;

/**
 * ЄДРПОУ (legal entities 8 digits) or РНОКПП/ІПН (individuals 10 digits).
 * In this dataset all values are 10-digit individual tax numbers.
 */
const EDRPOU_RE = /^\d{8}$|^\d{10}$/;

/**
 * Target-purpose code prefix in valid form: "XX.XX"
 * Raw data also contains: "02,01" / "02/01" / "02. 01" / "2.1." — we normalise.
 */
const PURPOSE_CODE_VALID_RE = /^(\d{2})\.(\d{2})(\s|$)/;
const PURPOSE_CODE_FIXABLE_RE = /^(\d{1,2})[.,/\s](\d{1,2})\.?\s*/;

@Injectable()
export class LandNormalizerService {
  private readonly logger = new Logger(LandNormalizerService.name);

  /**
   * Normalise a single raw row.
   * Returns the normalised record + a list of field-level errors (non-fatal).
   */
  normalizeRow(
    raw: RawLandRow,
    rowIndex: number,
  ): { record: NormalizedLandRecord; errors: ImportRowError[] } {
    const errors: ImportRowError[] = [];

    const addError = (field: string, rawValue: unknown, reason: string) => {
      errors.push({ row: rowIndex, field, rawValue, reason });
    };

    const record: NormalizedLandRecord = {
      cadastralNumber: this.parseCadastralNumber(
        raw['Кадастровий номер'],
        addError,
      ),
      koatuu: this.parseKoatuu(raw['koatuu'], addError),
      ownershipForm: this.parseOwnershipForm(raw['Форма власності'], addError),
      targetPurpose: this.parseTargetPurpose(
        raw['Цільове призначення'],
        addError,
      ),
      location: this.parseLocation(raw['Місцерозташування'], addError),
      landType: this.parseLandType(raw['Вид с/г угідь']),
      areaHa: this.parseArea(raw['Площа, га'], addError),
      monetaryValuation: this.parseMonetaryValuation(
        raw['Усереднена нормативно грошова оцінка'],
        addError,
      ),
      edrpou: this.parseEdrpou(raw['ЄДРПОУ землекористувача'], addError),
      landUser: this.parseName(raw['Землекористувач']),
      ownershipShare: this.parseOwnershipShare(
        raw['Частка володіння'],
        addError,
      ),
      registrationDate: this.parseDate(
        raw['Дата державної реєстрації права власності'],
        addError,
      ),
      recordNumber: this.parseRecordNumber(
        raw['Номер запису про право власності'],
        addError,
      ),
      registrarAuthority: this.parseText(
        raw['Орган, що здійснив державну реєстрацію права власності'],
      ),
      documentType: this.parseText(raw['Тип']),
      documentSubtype: this.parseText(raw['Підтип']),
    };

    return { record, errors };
  }

  // ─── Field parsers ────────────────────────────────────────────────────────

  private parseCadastralNumber(
    val: unknown,
    addError: ErrorReporter,
  ): string | null {
    const s = this.cleanString(val);
    if (!s) return null;

    if (CADASTRAL_RE.test(s)) return s;

    // Attempt to fix spaces inside the number
    const fixed = s.replace(/\s/g, '');
    if (CADASTRAL_RE.test(fixed)) return fixed;

    addError(
      'cadastralNumber',
      val,
      `Invalid format, expected XXXXXXXXXX:XX:XXX:XXXX`,
    );
    return null;
  }

  private parseKoatuu(val: unknown, addError: ErrorReporter): string | null {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number' && isNaN(val)) return null;

    // Comes as float 4624884200.0 → convert safely
    const num = typeof val === 'number' ? val : parseFloat(String(val));
    if (!isFinite(num)) return null;

    const s = Math.round(num).toString();
    if (KOATUU_RE.test(s)) return s;

    addError('koatuu', val, `Invalid KOATUU: expected 10 digits, got "${s}"`);
    return null;
  }

  private parseOwnershipForm(
    val: unknown,
    _addError: ErrorReporter,
  ): string | null {
    const s = this.cleanString(val);
    if (!s) return null;
    // Capitalise first letter, rest lowercase
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  /**
   * Normalises Цільове призначення:
   * - Strips leading/trailing whitespace
   * - Fixes malformed code prefixes: "02,01", "02/01", "2.1.", "02. 01" → "02.01"
   * - Preserves records without a code as plain text
   */
  private parseTargetPurpose(
    val: unknown,
    _addError: ErrorReporter,
  ): string | null {
    const s = this.cleanString(val);
    if (!s) return null;

    // Already valid
    if (PURPOSE_CODE_VALID_RE.test(s)) return s;

    // Try to fix the code prefix
    const match = s.match(PURPOSE_CODE_FIXABLE_RE);
    if (match) {
      const major = match[1].padStart(2, '0');
      const minor = match[2].padStart(2, '0');
      const rest = s.slice(match[0].length).trim();
      const code = `${major}.${minor}`;
      return rest ? `${code} ${rest}` : code;
    }

    // No code — return cleaned plain text
    return s;
  }

  /**
   * Normalises location string:
   * - Collapses whitespace
   * - Removes trailing dot/comma
   * - Fixes common Cyrillic/Latin homoglyph substitutions (о/O, i/і, с/c)
   */
  private parseLocation(val: unknown, _addError: ErrorReporter): string | null {
    let s = this.cleanString(val);
    if (!s) return null;

    s = this.fixCyrillicHomoglyphs(s);
    s = s.replace(/[.,]+$/, '').trim();
    // Collapse multiple spaces
    s = s.replace(/\s{2,}/g, ' ');
    return s || null;
  }

  /**
   * Land type can be a semicolon-separated compound value.
   * Title-case each segment and re-join.
   */
  private parseLandType(val: unknown): string | null {
    const s = this.cleanString(val);
    if (!s) return null;

    return s
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('; ');
  }

  private parseArea(val: unknown, addError: ErrorReporter): number | null {
    const n = this.parsePositiveFloat(val);
    if (n === null) {
      if (val !== null && val !== undefined && val !== '') {
        addError('areaHa', val, 'Could not parse area as positive number');
      }
      return null;
    }
    if (n === 0) {
      addError('areaHa', val, 'Area is zero');
      return null;
    }
    // Round to 4 decimal places (source precision)
    return Math.round(n * 10000) / 10000;
  }

  private parseMonetaryValuation(
    val: unknown,
    addError: ErrorReporter,
  ): number | null {
    const n = this.parsePositiveFloat(val);
    if (n === null) {
      if (val !== null && val !== undefined && val !== '') {
        addError(
          'monetaryValuation',
          val,
          'Could not parse monetary valuation',
        );
      }
      return null;
    }
    return Math.round(n * 10000) / 10000;
  }

  /**
   * ЄДРПОУ / РНОКПП: always stored as 10-digit string (left-padded with zeros).
   * Raw value comes as float → convert to integer string first.
   */
  private parseEdrpou(val: unknown, addError: ErrorReporter): string | null {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number' && isNaN(val)) return null;

    const num = typeof val === 'number' ? val : parseFloat(String(val));
    if (!isFinite(num)) return null;

    const s = Math.round(num).toString();
    if (EDRPOU_RE.test(s)) {
      // Pad to 10 digits for uniformity
      return s.padStart(10, '0');
    }

    addError(
      'edrpou',
      val,
      `Invalid ЄДРПОУ/РНОКПП: expected 8 or 10 digits, got "${s}" (${s.length} chars)`,
    );
    return null;
  }

  private parseName(val: unknown): string | null {
    const s = this.cleanString(val);
    if (!s) return null;
    // Fix Cyrillic homoglyphs that appear in names (Latin і, о, etc.)
    return this.fixCyrillicHomoglyphs(s);
  }

  /**
   * Ownership share: decimal fraction between 0.01 and 1.00.
   * Null in source = full ownership (1) — but we keep null to distinguish
   * "not specified" from "explicitly 1".
   */
  private parseOwnershipShare(
    val: unknown,
    addError: ErrorReporter,
  ): number | null {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number' && isNaN(val)) return null;

    const n = this.parsePositiveFloat(val);
    if (n === null) {
      addError('ownershipShare', val, 'Could not parse ownership share');
      return null;
    }
    if (n < 0.01 || n > 1.0) {
      addError(
        'ownershipShare',
        val,
        `Ownership share ${n} is outside valid range [0.01, 1.0]`,
      );
      return null;
    }
    // Round to 6 decimal places to avoid floating-point noise
    return Math.round(n * 1_000_000) / 1_000_000;
  }

  /**
   * Date parsing: accepts JS Date, ISO string, or Excel serial number.
   * Returns ISO date string "YYYY-MM-DD" or null.
   */
  private parseDate(val: unknown, addError: ErrorReporter): string | null {
    if (val === null || val === undefined || val === '') return null;

    let d: Date | null = null;

    if (val instanceof Date) {
      d = val;
    } else if (typeof val === 'string') {
      const dmY = val.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (dmY) {
        d = new Date(
          Date.UTC(Number(dmY[3]), Number(dmY[2]) - 1, Number(dmY[1])),
        );
      } else {
        const iso = Date.parse(val);
        if (!isNaN(iso)) {
          d = new Date(iso);
        }
      }
    } else if (typeof val === 'number') {
      // Excel serial date (days since 1899-12-30)
      if (val > 0 && val < 60000) {
        const excelEpoch = Date.UTC(1899, 11, 30);
        d = new Date(excelEpoch + val * 86_400_000);
      }
    }

    if (!d || isNaN(d.getTime())) {
      addError('registrationDate', val, 'Could not parse date');
      return null;
    }

    const year = d.getFullYear();
    if (year < 1991 || year > new Date().getFullYear()) {
      addError(
        'registrationDate',
        val,
        `Date year ${year} is outside plausible range (1991–present)`,
      );
      return null;
    }

    return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  /**
   * Registration record number: 5–8 digit integer stored as string.
   * Raw value comes as float.
   */
  private parseRecordNumber(
    val: unknown,
    addError: ErrorReporter,
  ): string | null {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number' && isNaN(val)) return null;

    const num = typeof val === 'number' ? val : parseFloat(String(val));
    if (!isFinite(num) || num <= 0) {
      addError('recordNumber', val, 'Invalid record number');
      return null;
    }

    const s = Math.round(num).toString();
    if (s.length < 5 || s.length > 9) {
      addError(
        'recordNumber',
        val,
        `Record number "${s}" has unexpected length ${s.length}`,
      );
      return null;
    }
    return s;
  }

  /** Generic plain-text field: trim, collapse spaces, fix homoglyphs. */
  private parseText(val: unknown): string | null {
    const s = this.cleanString(val);
    if (!s) return null;
    return this.fixCyrillicHomoglyphs(s);
  }

  // ─── Utility helpers ──────────────────────────────────────────────────────

  private cleanString(val: unknown): string | null {
    if (val === null || val === undefined) return null;
    if (typeof val === 'number' && isNaN(val)) return null;
    const s = String(val).trim();
    if (s === '' || s.toLowerCase() === 'nan' || s.toLowerCase() === 'null') {
      return null;
    }
    // Collapse internal whitespace
    return s.replace(/\s{2,}/g, ' ');
  }

  private parsePositiveFloat(val: unknown): number | null {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') {
      return isFinite(val) && val >= 0 ? val : null;
    }
    const s = String(val).trim().replace(/\s+/g, '').replace(',', '.');
    const n = parseFloat(s);
    return isFinite(n) && n >= 0 ? n : null;
  }

  /**
   * Replaces Latin homoglyphs that commonly appear in Ukrainian text exports:
   * Latin "i" → Ukrainian "і", Latin "o" / "O" → "о" / "О", etc.
   * Only applied when string is predominantly Cyrillic.
   */
  private fixCyrillicHomoglyphs(s: string): string {
    const cyrillicCount = (s.match(/[\u0400-\u04FF]/g) || []).length;
    if (cyrillicCount < s.length * 0.4) return s; // mostly non-Cyrillic, skip

    return s
      .replace(/i/g, 'і')
      .replace(/I/g, 'І')
      .replace(/o/g, 'о')
      .replace(/O/g, 'О')
      .replace(/a/g, 'а')
      .replace(/A/g, 'А')
      .replace(/e/g, 'е')
      .replace(/E/g, 'Е')
      .replace(/c/g, 'с')
      .replace(/C/g, 'С')
      .replace(/p/g, 'р')
      .replace(/P/g, 'Р')
      .replace(/x/g, 'х')
      .replace(/X/g, 'Х')
      .replace(/y/g, 'у')
      .replace(/Y/g, 'У')
      .replace(/k/g, 'к')
      .replace(/K/g, 'К')
      .replace(/m/g, 'м')
      .replace(/M/g, 'М')
      .replace(/h/g, 'н')
      .replace(/H/g, 'Н');
  }
}

type ErrorReporter = (field: string, rawValue: unknown, reason: string) => void;
