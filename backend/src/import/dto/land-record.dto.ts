/**
 * Raw row as parsed from the xlsx sheet (all values untouched).
 * Column names match the Ukrainian headers from the source file.
 */
export interface RawLandRow {
  'Кадастровий номер': unknown;
  koatuu: unknown;
  'Форма власності': unknown;
  'Цільове призначення': unknown;
  Місцерозташування: unknown;
  'Вид с/г угідь': unknown;
  'Площа, га': unknown;
  'Усереднена нормативно грошова оцінка': unknown;
  'ЄДРПОУ землекористувача': unknown;
  Землекористувач: unknown;
  'Частка володіння': unknown;
  'Дата державної реєстрації права власності': unknown;
  'Номер запису про право власності': unknown;
  'Орган, що здійснив державну реєстрацію права власності': unknown;
  Тип: unknown;
  Підтип: unknown;
}

/**
 * Fully normalised land parcel record.
 * Every field is either a correctly typed value or null.
 */
export interface NormalizedLandRecord {
  /** Format: XXXXXXXXXX:XX:XXX:XXXX */
  cadastralNumber: string | null;

  /** 10-digit КОАТУУ code as string (leading zeros preserved) */
  koatuu: string | null;

  /** Ownership form – always "Приватна" in this dataset */
  ownershipForm: string | null;

  /**
   * Target purpose with normalized code prefix.
   * Format: "XX.XX Назва" or plain text if no code present.
   */
  targetPurpose: string | null;

  /** Administrative location string, trimmed and deduplicated whitespace */
  location: string | null;

  /** Agricultural land type(s); semicolon-separated when multiple */
  landType: string | null;

  /** Area in hectares, up to 4 decimal places */
  areaHa: number | null;

  /** Normalised monetary valuation, rounded to 4 decimal places */
  monetaryValuation: number | null;

  /** ЄДРПОУ / РНОКПП of the land user – 10-char string */
  edrpou: string | null;

  /** Full name of the land user */
  landUser: string | null;

  /**
   * Ownership share as a decimal fraction [0.01 – 1.00].
   * null means the record has no share specified (treated as full ownership).
   */
  ownershipShare: number | null;

  /** ISO date string YYYY-MM-DD or null */
  registrationDate: string | null;

  /** Registration record number (5–8 digit integer stored as string) */
  recordNumber: string | null;

  /** Registrar authority name */
  registrarAuthority: string | null;

  /** Document type used for registration */
  documentType: string | null;

  /** Document sub-type / clarification */
  documentSubtype: string | null;
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: ImportRowError[];
  records: NormalizedLandRecord[];
}

export interface ImportRowError {
  row: number;
  field: string;
  rawValue: unknown;
  reason: string;
}
