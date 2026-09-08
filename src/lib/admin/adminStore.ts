"use client";

export interface ClientOrganization {
  id: number | string;
  name: string;
  email: string;
  plan: "Starter" | "Growth" | "Enterprise" | "Free Trial" | "Superadmin" | string;
  creditsBalance: number; // in USD
  totalMinutes: number;
  totalCalls: number;
  assignedNumber?: string;
  joinedAt?: string;
  joinedDate?: string;
  status: "active" | "suspended" | "trial" | string;
}

export interface MasterProviderKey {
  id: string;
  provider: string;
  service?: "STT" | "LLM" | "TTS" | "Telephony" | string;
  category?: string;
  label?: string;
  model?: string;
  voice?: string;
  maskedKey: string;
  isConfigured: boolean;
  isActive: boolean;
  costPerMin?: number;
}

export interface PlatformPricing {
  telephonyPerMin: number;
  sttPerMin: number;
  llmPerMin: number;
  ttsPerMin: number;
  platformMarkupPerMin: number;
  currency: string;
  defaultFreeTrialCredits: number;
}

export interface PlatformPhoneNumber {
  id: string;
  number: string;
  carrier: "Twilio" | "Telnyx" | "Tata Smartflo" | "Vonage" | string;
  type: "shared_trial" | "dedicated" | string;
  assignedToOrgId?: number | string;
  assignedToOrgName?: string;
  country: string;
  status: "available" | "in_use" | "reserved" | string;
  monthlyCost: number;
}

const STORAGE_KEYS = {
  CLIENTS: "callio_admin_clients",
  MASTER_KEYS: "callio_admin_master_keys",
  PRICING: "callio_admin_pricing",
  NUMBERS: "callio_admin_numbers",
  AUTO_FALLBACK: "callio_admin_auto_fallback",
};

export const DEFAULT_PRICING: PlatformPricing = {
  telephonyPerMin: 0.015,
  sttPerMin: 0.007,
  llmPerMin: 0.005,
  ttsPerMin: 0.018,
  platformMarkupPerMin: 0.105,
  currency: "USD",
  defaultFreeTrialCredits: 5.0,
};

export const INITIAL_CLIENTS: ClientOrganization[] = [
  {
    id: 1,
    name: "Apex Realty Group",
    email: "sarah@apexrealty.com",
    plan: "Growth",
    creditsBalance: 84.50,
    totalMinutes: 412,
    totalCalls: 186,
    assignedNumber: "+1 (415) 890-2341",
    joinedAt: "2026-08-14",
    status: "active",
  },
  {
    id: 2,
    name: "Metro Dental Clinic",
    email: "dr.kiran@metrodental.in",
    plan: "Starter",
    creditsBalance: 28.00,
    totalMinutes: 145,
    totalCalls: 98,
    assignedNumber: "+91 98110 44219",
    joinedAt: "2026-08-22",
    status: "active",
  },
  {
    id: 3,
    name: "Swift Haul Logistics",
    email: "dispatch@swifthaul.com",
    plan: "Enterprise",
    creditsBalance: 320.00,
    totalMinutes: 1840,
    totalCalls: 920,
    assignedNumber: "+1 (888) 429-1092",
    joinedAt: "2026-07-30",
    status: "active",
  },
  {
    id: 4,
    name: "Trial Workspace (Demo)",
    email: "client@callio.ai",
    plan: "Free Trial",
    creditsBalance: 5.00,
    totalMinutes: 14,
    totalCalls: 6,
    assignedNumber: "+1 (800) 249-CALL (Shared Pool)",
    joinedAt: "2026-09-02",
    status: "trial",
  },
];

export const INITIAL_MASTER_KEYS: MasterProviderKey[] = [
  {
    id: "key-1",
    provider: "Deepgram",
    service: "STT",
    label: "Deepgram Nova-2 (Production)",
    maskedKey: "dg_9a87...3f2b",
    isConfigured: true,
    isActive: true,
    costPerMin: 0.007,
  },
  {
    id: "key-2",
    provider: "Cartesia",
    service: "TTS",
    label: "Cartesia Sonic English & Multilingual",
    maskedKey: "cart_e471...99aa",
    isConfigured: true,
    isActive: true,
    costPerMin: 0.018,
  },
  {
    id: "key-3",
    provider: "OpenAI",
    service: "LLM",
    label: "OpenAI GPT-4o & GPT-4o-mini",
    maskedKey: "sk-proj-...88fe",
    isConfigured: true,
    isActive: true,
    costPerMin: 0.005,
  },
  {
    id: "key-4",
    provider: "Groq",
    service: "LLM",
    label: "Groq Llama 3.3 70B (Sub-100ms)",
    maskedKey: "gsk_411...99bc",
    isConfigured: true,
    isActive: true,
    costPerMin: 0.003,
  },
  {
    id: "key-5",
    provider: "ElevenLabs",
    service: "TTS",
    label: "ElevenLabs Flash v2.5",
    maskedKey: "el_542...aa12",
    isConfigured: true,
    isActive: true,
    costPerMin: 0.024,
  },
];

export const INITIAL_NUMBERS: PlatformPhoneNumber[] = [
  {
    id: "num-1",
    number: "+1 (800) 249-CALL",
    carrier: "Telnyx",
    type: "shared_trial",
    country: "US",
    status: "in_use",
    monthlyCost: 2.00,
  },
  {
    id: "num-2",
    number: "+1 (415) 890-2341",
    carrier: "Twilio",
    type: "dedicated",
    assignedToOrgId: 1,
    assignedToOrgName: "Apex Realty Group",
    country: "US",
    status: "in_use",
    monthlyCost: 3.00,
  },
  {
    id: "num-3",
    number: "+91 98110 44219",
    carrier: "Tata Smartflo",
    type: "dedicated",
    assignedToOrgId: 2,
    assignedToOrgName: "Metro Dental Clinic",
    country: "IN",
    status: "in_use",
    monthlyCost: 6.00,
  },
  {
    id: "num-4",
    number: "+1 (888) 429-1092",
    carrier: "Telnyx",
    type: "dedicated",
    assignedToOrgId: 3,
    assignedToOrgName: "Swift Haul Logistics",
    country: "US",
    status: "in_use",
    monthlyCost: 2.50,
  },
  {
    id: "num-5",
    number: "+1 (212) 555-0199",
    carrier: "Twilio",
    type: "dedicated",
    country: "US",
    status: "available",
    monthlyCost: 3.00,
  },
];

export class AdminStore {
  static getClients(): ClientOrganization[] {
    if (typeof window === "undefined") return INITIAL_CLIENTS;
    const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_CLIENTS;
    }
  }

  static grantCredits(orgId: number, amount: number): ClientOrganization[] {
    const clients = this.getClients();
    const updated = clients.map((c) =>
      c.id === orgId ? { ...c, creditsBalance: Number((c.creditsBalance + amount).toFixed(2)) } : c
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
    }
    return updated;
  }

  static getMasterKeys(): MasterProviderKey[] {
    if (typeof window === "undefined") return INITIAL_MASTER_KEYS;
    const stored = localStorage.getItem(STORAGE_KEYS.MASTER_KEYS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.MASTER_KEYS, JSON.stringify(INITIAL_MASTER_KEYS));
      return INITIAL_MASTER_KEYS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MASTER_KEYS;
    }
  }

  static updateMasterKey(id: string, partial: Partial<MasterProviderKey>): MasterProviderKey[] {
    const keys = this.getMasterKeys();
    const updated = keys.map((k) => (k.id === id ? { ...k, ...partial } : k));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.MASTER_KEYS, JSON.stringify(updated));
    }
    return updated;
  }

  static getPricing(): PlatformPricing {
    if (typeof window === "undefined") return DEFAULT_PRICING;
    const stored = localStorage.getItem(STORAGE_KEYS.PRICING);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
      return DEFAULT_PRICING;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PRICING;
    }
  }

  static savePricing(pricing: PlatformPricing): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
    }
  }

  static getNumbers(): PlatformPhoneNumber[] {
    if (typeof window === "undefined") return INITIAL_NUMBERS;
    const stored = localStorage.getItem(STORAGE_KEYS.NUMBERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.NUMBERS, JSON.stringify(INITIAL_NUMBERS));
      return INITIAL_NUMBERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_NUMBERS;
    }
  }

  static addNumber(num: Omit<PlatformPhoneNumber, "id">): PlatformPhoneNumber[] {
    const numbers = this.getNumbers();
    const newEntry: PlatformPhoneNumber = {
      ...num,
      id: `num-${Date.now()}`,
    };
    const updated = [newEntry, ...numbers];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.NUMBERS, JSON.stringify(updated));
    }
    return updated;
  }

  static assignNumberToOrg(numId: string, orgId: number, orgName: string): PlatformPhoneNumber[] {
    const numbers = this.getNumbers();
    const updated = numbers.map((n) =>
      n.id === numId
        ? {
            ...n,
            type: "dedicated" as const,
            status: "in_use" as const,
            assignedToOrgId: orgId,
            assignedToOrgName: orgName,
          }
        : n
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.NUMBERS, JSON.stringify(updated));
    }
    return updated;
  }

  static getAutoFallback(): boolean {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(STORAGE_KEYS.AUTO_FALLBACK);
    return stored ? stored === "true" : true;
  }

  static setAutoFallback(val: boolean): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTO_FALLBACK, String(val));
    }
  }
}
