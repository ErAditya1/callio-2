/**
 * Utility functions for parsing CSV and pasted text contacts with phone normalization.
 */

export interface ParsedContactRow {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  status: 'valid' | 'invalid' | 'duplicate';
  reason?: string;
  rawPhone?: string;
}

export interface ParseResult {
  headers: string[];
  rows: ParsedContactRow[];
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  validContacts: Array<{
    name: string;
    phone: string;
    email?: string;
    company?: string;
    city?: string;
  }>;
}

/**
 * Normalizes a phone number.
 * Supports:
 * - Indian mobiles: 10 digits starting with 6-9 -> +91XXXXXXXXXX
 * - 91XXXXXXXXXX / 0XXXXXXXXXX -> +91XXXXXXXXXX
 * - E.164 international numbers: +XXXXXXXXXXX
 */
export function normalizePhone(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();

  // If already starts with +, normalize digits after +
  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '');
    if (digits.length >= 7 && digits.length <= 15) {
      return `+${digits}`;
    }
    return null;
  }

  const digits = trimmed.replace(/\D/g, '');

  // Indian mobile detection
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^91[6-9]\d{9}$/.test(digits)) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0') && /^0[6-9]\d{9}$/.test(digits)) {
    return `+91${digits.slice(1)}`;
  }

  // General international without leading + (if standard length 10-15 digits)
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }

  return null;
}

/**
 * Format phone for display (+91 98765 43210)
 */
export function formatPhone(phone: string): string {
  if (phone.startsWith('+91') && phone.length === 13) {
    const local = phone.slice(3);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone;
}

/**
 * Parses CSV text, identifying column headers and rows with validation.
 */
export function parseContactsCsv(text: string): ParseResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [], validCount: 0, invalidCount: 0, duplicateCount: 0, validContacts: [] };
  }

  const splitCsvLine = (line: string): string[] => {
    return (
      line
        .match(/("([^"]|"")*"|[^,]*)(,|$)/g)
        ?.map((c) =>
          c
            .replace(/,$/, '')
            .replace(/^"|"$/g, '')
            .replace(/""/g, '"')
            .trim()
        ) ?? []
    );
  };

  const rawHeaders = splitCsvLine(lines[0] ?? '');
  const lowerHeaders = rawHeaders.map((h) => h.toLowerCase());

  const findColIndex = (keywords: string[]): number => {
    return lowerHeaders.findIndex((h) => keywords.some((k) => h.includes(k)));
  };

  const iPhone = findColIndex(['phone', 'mobile', 'number', 'contact', 'cell', 'tel']);
  const iName = findColIndex(['name', 'full_name', 'fullname', 'first_name', 'customer']);
  const iEmail = findColIndex(['email', 'mail']);
  const iCompany = findColIndex(['company', 'organization', 'org', 'business']);
  const iCity = findColIndex(['city', 'location', 'town', 'state', 'address']);

  const seenPhones = new Set<string>();
  const rows: ParsedContactRow[] = [];
  const validContacts: Array<{ name: string; phone: string; email?: string; company?: string; city?: string }> = [];

  const dataLines = iPhone >= 0 ? lines.slice(1) : lines; // If no header detected, treat all as rows

  for (let idx = 0; idx < dataLines.length; idx++) {
    const cols = splitCsvLine(dataLines[idx]);
    if (cols.every((c) => !c)) continue;

    const rawPhone = iPhone >= 0 ? cols[iPhone] ?? '' : cols[0] ?? '';
    const rawName = iName >= 0 ? cols[iName] ?? '' : '';
    const email = iEmail >= 0 ? cols[iEmail] || undefined : undefined;
    const company = iCompany >= 0 ? cols[iCompany] || undefined : undefined;
    const city = iCity >= 0 ? cols[iCity] || undefined : undefined;

    const normalized = normalizePhone(rawPhone);
    const name = rawName || 'Customer';

    if (!rawPhone) {
      rows.push({
        name,
        phone: '',
        email,
        company,
        city,
        status: 'invalid',
        reason: 'Missing phone number',
        rawPhone,
      });
      continue;
    }

    if (!normalized) {
      rows.push({
        name,
        phone: rawPhone,
        email,
        company,
        city,
        status: 'invalid',
        reason: 'Invalid phone format',
        rawPhone,
      });
      continue;
    }

    if (seenPhones.has(normalized)) {
      rows.push({
        name,
        phone: normalized,
        email,
        company,
        city,
        status: 'duplicate',
        reason: 'Duplicate phone number',
        rawPhone,
      });
      continue;
    }

    seenPhones.add(normalized);
    const validItem = { name, phone: normalized, email, company, city };
    validContacts.push(validItem);
    rows.push({
      ...validItem,
      status: 'valid',
      rawPhone,
    });
  }

  return {
    headers: rawHeaders,
    rows,
    validCount: validContacts.length,
    invalidCount: rows.filter((r) => r.status === 'invalid').length,
    duplicateCount: rows.filter((r) => r.status === 'duplicate').length,
    validContacts,
  };
}

/**
 * Parses freeform pasted text (lines with numbers or comma/tab-separated values).
 */
export function parsePastedContacts(text: string): ParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    return { headers: ['name', 'phone'], rows: [], validCount: 0, invalidCount: 0, duplicateCount: 0, validContacts: [] };
  }

  const seenPhones = new Set<string>();
  const rows: ParsedContactRow[] = [];
  const validContacts: Array<{ name: string; phone: string; email?: string; company?: string; city?: string }> = [];

  for (const line of lines) {
    // Delimited by comma, tab, or semicolon
    const parts = line.split(/[,\t;]+/).map((p) => p.trim()).filter(Boolean);

    let rawPhone = '';
    let name = 'Customer';
    let email: string | undefined;

    if (parts.length === 1) {
      rawPhone = parts[0];
    } else if (parts.length === 2) {
      // Check which one is the phone
      if (normalizePhone(parts[1])) {
        name = parts[0] || 'Customer';
        rawPhone = parts[1];
      } else if (normalizePhone(parts[0])) {
        rawPhone = parts[0];
        name = parts[1] || 'Customer';
      } else {
        name = parts[0];
        rawPhone = parts[1];
      }
    } else if (parts.length >= 3) {
      name = parts[0];
      rawPhone = parts[1];
      email = parts[2].includes('@') ? parts[2] : undefined;
    }

    const normalized = normalizePhone(rawPhone);

    if (!rawPhone) {
      rows.push({
        name,
        phone: '',
        email,
        status: 'invalid',
        reason: 'Empty phone number',
        rawPhone,
      });
      continue;
    }

    if (!normalized) {
      rows.push({
        name,
        phone: rawPhone,
        email,
        status: 'invalid',
        reason: 'Invalid phone number format',
        rawPhone,
      });
      continue;
    }

    if (seenPhones.has(normalized)) {
      rows.push({
        name,
        phone: normalized,
        email,
        status: 'duplicate',
        reason: 'Duplicate number',
        rawPhone,
      });
      continue;
    }

    seenPhones.add(normalized);
    const validItem = { name, phone: normalized, email };
    validContacts.push(validItem);
    rows.push({
      ...validItem,
      status: 'valid',
      rawPhone,
    });
  }

  return {
    headers: ['Name', 'Phone', 'Email'],
    rows,
    validCount: validContacts.length,
    invalidCount: rows.filter((r) => r.status === 'invalid').length,
    duplicateCount: rows.filter((r) => r.status === 'duplicate').length,
    validContacts,
  };
}
