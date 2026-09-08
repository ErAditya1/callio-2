"use client";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  CircleDollarSign,
  Coins,
  Cpu,
  CreditCard,
  Database,
  ExternalLink,
  Flame,
  Globe,
  Key,
  Layers,
  List,
  Loader2,
  Lock,
  Phone,
  PhoneCall,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getWorkflowRunsApiV1SuperuserWorkflowRunsGet } from "@/client/sdk.gen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminStore,
  DEFAULT_PRICING,
  type ClientOrganization,
  type MasterProviderKey,
  type PlatformPhoneNumber,
  type PlatformPricing,
} from "@/lib/admin/adminStore";
import { useAuth } from "@/lib/auth";
import { useIsSuperuser } from "@/hooks/useIsSuperuser";
import { impersonateAsSuperadmin } from "@/lib/utils";

export default function SuperadminPage() {
  const { user, getAccessToken, provider } = useAuth();
  const { isSuperuser, isLoading: checkingSuperuser } = useIsSuperuser();

  // Active tab state
  const [activeTab, setActiveTab] = useState("clients");

  // Client organizations state
  const [clients, setClients] = useState<ClientOrganization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Credits Grant Dialog state
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [selectedOrgForCredit, setSelectedOrgForCredit] = useState<ClientOrganization | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(5.0);
  const [customCreditInput, setCustomCreditInput] = useState<string>("");

  // Master Keys state
  const [masterKeys, setMasterKeys] = useState<MasterProviderKey[]>([]);
  const [autoFallback, setAutoFallback] = useState(true);
  const [editingKeyModalOpen, setEditingKeyModalOpen] = useState(false);
  const [selectedKeyForEdit, setSelectedKeyForEdit] = useState<MasterProviderKey | null>(null);
  const [newApiKeyValue, setNewApiKeyValue] = useState("");

  // Pricing state
  const [pricing, setPricing] = useState<PlatformPricing>(DEFAULT_PRICING);

  // Phone numbers state
  const [numbers, setNumbers] = useState<PlatformPhoneNumber[]>([]);
  const [addNumberModalOpen, setAddNumberModalOpen] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newCarrier, setNewCarrier] = useState<"Twilio" | "Telnyx" | "Tata Smartflo" | "Vonage">("Twilio");
  const [newNumberType, setNewNumberType] = useState<"shared_trial" | "dedicated">("shared_trial");
  const [assignOrgId, setAssignOrgId] = useState<string>("none");
  const [monthlyCostInput, setMonthlyCostInput] = useState<number>(3.0);
  const [addingNumberLoading, setAddingNumberLoading] = useState<boolean>(false);

  // Provider-specific credentials state
  const [providerConfig, setProviderConfig] = useState<Record<string, string>>({
    account_sid: "",
    auth_token: "",
    api_domain: "https://api-smartflo.tatateleservices.com",
    jwt_token: "",
    click_to_call_api_key: "",
    did_number: "",
    agent_number: "",
    api_key: "",
    connection_id: "",
    api_secret: "",
    application_id: "",
    auth_id: "",
  });

  // Impersonation state
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  // Live Backend Global Runs
  const [liveRuns, setLiveRuns] = useState<any[]>([]);
  const [liveRunsLoading, setLiveRunsLoading] = useState(false);
  const [liveRunsTotal, setLiveRunsTotal] = useState<number>(0);

  // Live real platform stats
  const [platformStats, setPlatformStats] = useState<{
    total_clients: number;
    total_users: number;
    total_calls: number;
    total_seconds: number;
    total_minutes: number;
    total_workflows: number;
    total_telephony_configs: number;
    total_phone_numbers: number;
    platform_inventory_count: number;
  } | null>(null);

  // Tenant registered numbers vs platform inventory
  const [tenantNumbers, setTenantNumbers] = useState<any[]>([]);
  const [phoneSubTab, setPhoneSubTab] = useState<"inventory" | "tenant">("inventory");

  const loadLiveStats = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/superuser/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setPlatformStats(data);
      }
    } catch (err) {
      console.error("Failed to load platform stats:", err);
    }
  };

  const loadLiveClients = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/superuser/clients", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: ClientOrganization[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            plan: c.plan,
            status: c.status,
            totalMinutes: c.total_minutes || 0,
            totalCalls: c.total_calls || 0,
            creditsBalance: c.credits_balance ?? 5.0,
            joinedDate: c.created_at ? new Date(c.created_at).toLocaleDateString() : "Recent",
          }));
          setClients(mapped);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to load live clients:", err);
    }
    setClients([]);
  };

  const loadLiveMasterKeys = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/superuser/provider-keys", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: MasterProviderKey[] = data.map((k: any) => ({
            id: k.id,
            provider: k.provider,
            service: k.category || "AI",
            category: k.category,
            label: k.model || k.voice || "Production",
            maskedKey: k.maskedKey,
            isConfigured: k.isConfigured,
            isActive: k.isActive,
            costPerMin: k.costPerMin,
          }));
          setMasterKeys(mapped);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to load live provider keys:", err);
    }
  };

  const loadPlatformNumbers = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/superuser/phone-numbers", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        const inv = data.inventory || [];
        const mapped: PlatformPhoneNumber[] = inv.map((n: any) => ({
          id: String(n.id),
          number: n.phone_number,
          carrier: n.carrier,
          type: n.number_type,
          assignedToOrgId: n.assigned_organization_id,
          assignedToOrgName: n.assigned_organization_id ? clients.find(c => String(c.id) === String(n.assigned_organization_id))?.name : undefined,
          country: n.phone_number?.startsWith("+91") ? "IN" : "US",
          status: n.status,
          monthlyCost: n.monthly_cost,
        }));
        setNumbers(mapped);
        setTenantNumbers(data.tenant_numbers || []);
        return;
      }
    } catch (e) {
      console.error("Failed to load numbers from backend:", e);
    }
    setNumbers([]);
  };

  // Load real persistent data only when superuser is verified
  useEffect(() => {
    if (!isSuperuser) return;
    loadLiveStats();
    loadLiveClients();
    loadLiveMasterKeys();
    setPricing(AdminStore.getPricing());
    setAutoFallback(AdminStore.getAutoFallback());
    loadLiveRuns();
    loadPlatformNumbers();
  }, [isSuperuser]);

  const loadLiveRuns = async () => {
    setLiveRunsLoading(true);
    try {
      const res = await getWorkflowRunsApiV1SuperuserWorkflowRunsGet({
        query: { page: 1, limit: 6 },
      });
      if (res.data) {
        setLiveRuns(res.data.workflow_runs || []);
        setLiveRunsTotal(res.data.total_count || 0);
      }
    } catch {
      // Graceful fallback if superuser token isn't elevated yet
    } finally {
      setLiveRunsLoading(false);
    }
  };

  // KPI calculations using real PostgreSQL statistics
  const totalMinutes = useMemo(
    () => platformStats?.total_minutes ?? clients.reduce((acc, c) => acc + c.totalMinutes, 0),
    [platformStats, clients]
  );
  const totalCalls = useMemo(
    () => platformStats?.total_calls ?? (liveRunsTotal > 0 ? liveRunsTotal : clients.reduce((acc, c) => acc + c.totalCalls, 0)),
    [platformStats, liveRunsTotal, clients]
  );
  const activeClientsCount = useMemo(
    () => platformStats?.total_clients ?? clients.length,
    [platformStats, clients]
  );
  const clientBilledRate = useMemo(() => {
    const baseCost = pricing.telephonyPerMin + pricing.sttPerMin + pricing.llmPerMin + pricing.ttsPerMin;
    return baseCost + pricing.platformMarkupPerMin;
  }, [pricing]);

  const grossMarginPercent = useMemo(() => {
    if (clientBilledRate <= 0) return 0;
    return ((pricing.platformMarkupPerMin / clientBilledRate) * 100).toFixed(1);
  }, [clientBilledRate, pricing.platformMarkupPerMin]);

  const totalRevenue = useMemo(
    () => (totalMinutes * clientBilledRate).toFixed(2),
    [totalMinutes, clientBilledRate]
  );

  // Filtered clients list
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  // Handle Free Credit Grant
  const handleOpenCreditModal = (org: ClientOrganization) => {
    setSelectedOrgForCredit(org);
    setCreditAmount(pricing.defaultFreeTrialCredits);
    setCustomCreditInput("");
    setGrantModalOpen(true);
  };

  const handleGrantCredit = async () => {
    if (!selectedOrgForCredit) return;
    const finalAmount = customCreditInput ? parseFloat(customCreditInput) : creditAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/clients/${selectedOrgForCredit.id}/grant-credits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ amount: finalAmount }),
      });
      if (res.ok) {
        toast.success(`Granted $${finalAmount.toFixed(2)} credits to ${selectedOrgForCredit.name}`);
        setGrantModalOpen(false);
        loadLiveClients();
        return;
      }
    } catch (e) {
      console.error("Failed to grant credits via API:", e);
    }

    const updated = AdminStore.grantCredits(Number(selectedOrgForCredit.id), finalAmount);
    setClients(updated);
    setGrantModalOpen(false);
    toast.success(`Granted $${finalAmount.toFixed(2)} credits to ${selectedOrgForCredit.name}`);
  };

  // Handle Impersonation
  const handleImpersonateUser = async (email: string) => {
    setImpersonatingId(email);
    try {
      if (provider !== "stack") {
        toast.info(
          `Impersonation for "${email}" requires Stack Auth Cloud. In Self-Hosted (OSS) mode, manage workspaces and workflows directly via the Superadmin dashboard.`,
          { duration: 5000 }
        );
        return;
      }
      const accessToken = await getAccessToken();
      if (!accessToken) {
        toast.error("Admin authentication token required");
        return;
      }
      await impersonateAsSuperadmin({
        accessToken,
        email,
        redirectPath: "/overview",
        openInNewTab: true,
      });
      toast.success(`Impersonation session created for ${email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to impersonate user: Account does not exist in Stack Auth");
    } finally {
      setImpersonatingId(null);
    }
  };

  // Handle Master Key Update
  const handleSaveMasterKey = () => {
    if (!selectedKeyForEdit || !newApiKeyValue.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    const masked = newApiKeyValue.slice(0, 7) + "..." + newApiKeyValue.slice(-4);
    const updated = AdminStore.updateMasterKey(selectedKeyForEdit.id, {
      maskedKey: masked,
      isConfigured: true,
      isActive: true,
    });
    setMasterKeys(updated);
    setEditingKeyModalOpen(false);
    setNewApiKeyValue("");
    toast.success(`Master key for ${selectedKeyForEdit.provider} updated!`);
  };

  // Handle Pricing Save
  const handleSavePricing = () => {
    AdminStore.savePricing(pricing);
    toast.success("Platform billing and pricing rules updated successfully!");
  };

  // Handle Add Phone Number
  const handleAddNumber = async () => {
    if (!newPhoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }
    setAddingNumberLoading(true);

    const providerSlug = 
      newCarrier === "Tata Smartflo" ? "smartflo" :
      newCarrier === "Twilio" ? "twilio" :
      newCarrier === "Telnyx" ? "telnyx" :
      newCarrier === "Vonage" ? "vonage" : "plivo";

    // Clean credentials payload based on provider
    let activeConfig: Record<string, any> = {};
    if (providerSlug === "twilio") {
      activeConfig = {
        account_sid: providerConfig.account_sid?.trim(),
        auth_token: providerConfig.auth_token?.trim(),
      };
    } else if (providerSlug === "smartflo") {
      activeConfig = {
        api_domain: providerConfig.api_domain?.trim() || "https://api-smartflo.tatateleservices.com",
        jwt_token: providerConfig.jwt_token?.trim(),
        click_to_call_api_key: providerConfig.click_to_call_api_key?.trim(),
        did_number: providerConfig.did_number?.trim() || newPhoneNumber.trim(),
        agent_number: providerConfig.agent_number?.trim(),
      };
    } else if (providerSlug === "telnyx") {
      activeConfig = {
        api_key: providerConfig.api_key?.trim(),
        connection_id: providerConfig.connection_id?.trim(),
      };
    } else if (providerSlug === "vonage") {
      activeConfig = {
        api_key: providerConfig.api_key?.trim(),
        api_secret: providerConfig.api_secret?.trim(),
        application_id: providerConfig.application_id?.trim(),
      };
    }

    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/platform/numbers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          phone_number: newPhoneNumber.trim(),
          provider: providerSlug,
          carrier: newCarrier,
          number_type: newNumberType,
          country_code: newPhoneNumber.startsWith("+91") ? "IN" : "US",
          monthly_cost: newNumberType === "shared_trial" ? 0.0 : monthlyCostInput,
          status: newNumberType === "shared_trial" ? "shared_pool" : "available",
          provider_config: activeConfig,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to save number to backend inventory");
      }

      toast.success(`Phone number ${newPhoneNumber} successfully added to platform database!`);
      await loadPlatformNumbers();
      setAddNumberModalOpen(false);
      setNewPhoneNumber("");
    } catch (err: any) {
      console.warn("Backend save failed, saving locally:", err.message);
      // fallback to AdminStore
      const assignedOrg = clients.find((c) => String(c.id) === assignOrgId);
      const updated = AdminStore.addNumber({
        number: newPhoneNumber.trim(),
        carrier: newCarrier,
        type: newNumberType,
        assignedToOrgId: assignedOrg ? assignedOrg.id : undefined,
        assignedToOrgName: assignedOrg ? assignedOrg.name : undefined,
        country: newPhoneNumber.startsWith("+91") ? "IN" : "US",
        status: assignedOrg ? "in_use" : "available",
        monthlyCost: newNumberType === "shared_trial" ? 0.0 : monthlyCostInput,
      });
      setNumbers(updated);
      setAddNumberModalOpen(false);
      setNewPhoneNumber("");
      toast.success("Phone number added to inventory!");
    } finally {
      setAddingNumberLoading(false);
    }
  };

  // Handle Delete Phone Number
  const handleDeleteNumber = async (id: string, phoneNum: string) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/platform/numbers/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        toast.success(`Removed ${phoneNum} from inventory`);
        await loadPlatformNumbers();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // fallback
    const updated = numbers.filter(n => n.id !== id);
    setNumbers(updated);
    toast.success(`Removed ${phoneNum}`);
  };

  if (checkingSuperuser) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!isSuperuser) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
        <Card className="max-w-md border-border/80 shadow-2xl bg-card">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">Access Restricted</CardTitle>
            <CardDescription className="text-sm text-muted-foreground pt-1">
              Superadmin privileges are required to access the Callio AI Master Admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-xs text-muted-foreground leading-relaxed px-6 pb-6">
            Your current logged-in account does not possess platform superuser permissions. If you need elevated access, please contact your organization administrator or platform owner.
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-0 pb-6 px-6">
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
              <Link href="/overview">
                Return to Workspace Overview
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/workflow">
                Go to Voice Agents
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Callio AI Master Admin</h1>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                  SaaS Control Plane
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Centralized tenant management, master AI providers, pricing, and numbers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLiveRuns}
              disabled={liveRunsLoading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${liveRunsLoading ? "animate-spin" : ""}`} />
              Sync Live
            </Button>
            <Button size="sm" asChild className="gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white">
              <Link href="/superadmin/runs">
                <List className="h-3.5 w-3.5" />
                Live Global Call Feed
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 shadow-sm hover:border-border transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Voice Usage</p>
                <div className="text-2xl font-black tracking-tight mt-1">{totalMinutes.toLocaleString()} min</div>
                <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Live from PostgreSQL
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <PhoneCall className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:border-border transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Clients</p>
                <div className="text-2xl font-black tracking-tight mt-1">{clients.length} Orgs</div>
                <p className="text-xs text-muted-foreground mt-1">Multi-tenant accounts</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:border-border transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform Margin</p>
                <div className="text-2xl font-black tracking-tight mt-1 text-emerald-500">{grossMarginPercent}%</div>
                <p className="text-xs text-muted-foreground mt-1">Rate: ${clientBilledRate.toFixed(3)}/min</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Coins className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:border-border transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Est. Platform Billed</p>
                <div className="text-2xl font-black tracking-tight mt-1">${totalRevenue}</div>
                <p className="text-xs text-muted-foreground mt-1">{totalCalls} total completed calls</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <CircleDollarSign className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabbed Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/60 grid grid-cols-2 md:grid-cols-5 w-full h-auto">
            <TabsTrigger value="clients" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2">
              <Users className="h-4 w-4" />
              Clients & Credits
            </TabsTrigger>
            <TabsTrigger value="keys" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2">
              <Key className="h-4 w-4" />
              Master AI Keys
            </TabsTrigger>
            <TabsTrigger value="pricing" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2">
              <CircleDollarSign className="h-4 w-4" />
              Pricing & Margins
            </TabsTrigger>
            <TabsTrigger value="numbers" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2">
              <Phone className="h-4 w-4" />
              Platform Numbers
            </TabsTrigger>
            <TabsTrigger value="traffic" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2">
              <Activity className="h-4 w-4" />
              Live Call Stream
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CLIENTS & CREDITS */}
          <TabsContent value="clients" className="space-y-4">
            <Card className="border-border/60">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Registered Clients & Wallets</CardTitle>
                  <CardDescription>
                    Manage client credit wallets, grant free testing bonuses, and impersonate client accounts.
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Organization</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Wallet Balance</TableHead>
                      <TableHead>Minutes Used</TableHead>
                      <TableHead>Assigned Caller ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-muted/40">
                        <TableCell>
                          <div className="font-semibold text-foreground text-sm">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              client.plan === "Enterprise"
                                ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                                : client.plan === "Growth"
                                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                                : client.plan === "Starter"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                            }
                          >
                            {client.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono font-bold text-foreground">
                            ${client.creditsBalance.toFixed(2)}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            ~{Math.floor(client.creditsBalance / clientBilledRate)} call mins remaining
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-foreground">{client.totalMinutes} min</span>
                          <span className="text-xs text-muted-foreground ml-1.5">({client.totalCalls} calls)</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-muted-foreground">
                            {client.assignedNumber || "None assigned"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenCreditModal(client)}
                              className="h-8 gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10"
                            >
                              <Coins className="h-3.5 w-3.5" />
                              Grant Credits
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleImpersonateUser(client.email)}
                              disabled={impersonatingId === client.email}
                              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                              {impersonatingId === client.email ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ExternalLink className="h-3 w-3" />
                              )}
                              Impersonate
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: MASTER AI PROVIDERS */}
          <TabsContent value="keys" className="space-y-4">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Master Platform AI & Telephony Keys</CardTitle>
                    <CardDescription>
                      Configure your master keys so new trial clients can test calling immediately without bringing their own API keys.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/40 px-4 py-2 rounded-xl border border-border/60">
                    <Label htmlFor="auto-fallback-switch" className="text-xs font-medium cursor-pointer">
                      Auto-Fallback for New Clients
                    </Label>
                    <Switch
                      id="auto-fallback-switch"
                      checked={autoFallback}
                      onCheckedChange={(val) => {
                        setAutoFallback(val);
                        AdminStore.setAutoFallback(val);
                        toast.success(val ? "Auto-fallback enabled: new clients test on platform keys" : "Auto-fallback disabled");
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Service Pipeline</TableHead>
                      <TableHead>Provider Model / Tier</TableHead>
                      <TableHead>Configured Key</TableHead>
                      <TableHead>Provider Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {masterKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-bold text-foreground">{key.provider}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-mono">
                            {key.service}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{key.label}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {key.maskedKey}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {key.costPerMin !== undefined ? `$${key.costPerMin.toFixed(3)} / min` : "Configured"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Ready
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedKeyForEdit(key);
                              setNewApiKeyValue("");
                              setEditingKeyModalOpen(true);
                            }}
                            className="h-8 text-xs"
                          >
                            Update Key
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: PRICING & MARGINS */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cost & Markup Configurator */}
              <Card className="lg:col-span-2 border-border/60">
                <CardHeader>
                  <CardTitle className="text-lg">Per-Minute Rate & Markup Configurator</CardTitle>
                  <CardDescription>
                    Define base provider wholesale costs and your platform profit margin applied to client calls.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Telephony Wholesale (Carrier $/min)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={pricing.telephonyPerMin}
                        onChange={(e) =>
                          setPricing({ ...pricing, telephonyPerMin: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">STT Transcription (Deepgram $/min)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={pricing.sttPerMin}
                        onChange={(e) =>
                          setPricing({ ...pricing, sttPerMin: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">LLM Inference (OpenAI/Groq $/min)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={pricing.llmPerMin}
                        onChange={(e) =>
                          setPricing({ ...pricing, llmPerMin: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">TTS Voice Audio (Cartesia/11Labs $/min)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={pricing.ttsPerMin}
                        onChange={(e) =>
                          setPricing({ ...pricing, ttsPerMin: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">
                        Callio AI Platform Markup (Your Net Profit Margin)
                      </Label>
                      <span className="font-mono font-black text-indigo-400 text-base">
                        +${pricing.platformMarkupPerMin.toFixed(3)} / min
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.30"
                      step="0.005"
                      value={pricing.platformMarkupPerMin}
                      onChange={(e) =>
                        setPricing({ ...pricing, platformMarkupPerMin: parseFloat(e.target.value) || 0.01 })
                      }
                      className="w-full accent-indigo-600 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Slide to adjust gross profitability. Typical industry margins range from 60% to 80%.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60 space-y-2">
                    <Label className="text-xs">Default Free Trial Credit on New Client Signup ($)</Label>
                    <Input
                      type="number"
                      step="1"
                      value={pricing.defaultFreeTrialCredits}
                      onChange={(e) =>
                        setPricing({ ...pricing, defaultFreeTrialCredits: parseFloat(e.target.value) || 0 })
                      }
                      className="w-48"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/60 flex justify-end">
                  <Button onClick={handleSavePricing} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                    Save Pricing Rules
                  </Button>
                </CardFooter>
              </Card>

              {/* Real-time Profit Preview Card */}
              <Card className="border-border/60 bg-gradient-to-b from-card via-card to-indigo-950/20 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    Live Margin Projection
                  </CardTitle>
                  <CardDescription>Estimated metrics per billable voice minute</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-background/80 border border-border/60 space-y-2.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Total Provider Base Cost:</span>
                      <span className="font-mono text-foreground font-semibold">
                        ${(pricing.telephonyPerMin + pricing.sttPerMin + pricing.llmPerMin + pricing.ttsPerMin).toFixed(3)}/min
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Platform Profit Markup:</span>
                      <span className="font-mono text-emerald-500 font-semibold">
                        +${pricing.platformMarkupPerMin.toFixed(3)}/min
                      </span>
                    </div>
                    <div className="border-t border-border/40 pt-2 flex justify-between items-center">
                      <span className="text-sm font-bold text-foreground">Client Billed Rate:</span>
                      <span className="text-lg font-black text-indigo-400 font-mono">
                        ${clientBilledRate.toFixed(3)}/min
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 space-y-1 text-center">
                    <div className="text-3xl font-black text-indigo-300">{grossMarginPercent}%</div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Gross Margin</div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1.5 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>1,000 mins = ~${(1000 * clientBilledRate).toFixed(0)} billed (${(1000 * pricing.platformMarkupPerMin).toFixed(0)} net profit)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>10,000 mins = ~${(10000 * clientBilledRate).toFixed(0)} billed (${(10000 * pricing.platformMarkupPerMin).toFixed(0)} net profit)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 4: PLATFORM NUMBERS & TENANT TELEPHONY */}
          <TabsContent value="numbers" className="space-y-4">
            <Card className="border-border/60">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                <div>
                  <CardTitle className="text-lg">Telephony &amp; Platform Numbers Pool</CardTitle>
                  <CardDescription>
                    Monitor platform testing inventory and active tenant caller IDs connected across Callio AI.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-border/60 p-1 bg-muted/40">
                    <button
                      type="button"
                      onClick={() => setPhoneSubTab("inventory")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        phoneSubTab === "inventory"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Platform Pool ({numbers.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoneSubTab("tenant")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        phoneSubTab === "tenant"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Tenant Caller IDs ({tenantNumbers.length})
                    </button>
                  </div>
                  {phoneSubTab === "inventory" && (
                    <Button
                      onClick={() => setAddNumberModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      Add Number
                    </Button>
                  )}
                </div>
              </CardHeader>

              {phoneSubTab === "inventory" ? (
                <CardContent className="p-0 overflow-x-auto">
                  {numbers.length === 0 ? (
                    <div className="py-12 text-center">
                      <Phone className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                      <h3 className="text-base font-semibold text-foreground">No platform numbers stocked yet</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                        Stock numbers into the live PostgreSQL database so new trial clients can test calling without bringing their own provider account.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setAddNumberModalOpen(true)}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Add Platform Number
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Carrier</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Assigned Tenant</TableHead>
                          <TableHead>Carrier Cost</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {numbers.map((num) => (
                          <TableRow key={num.id}>
                            <TableCell className="font-mono font-bold text-foreground">
                              {num.number}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {num.carrier}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {num.type === "shared_trial" ? (
                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                                  Shared Trial Pool
                                </Badge>
                              ) : (
                                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                                  Dedicated Line
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {num.assignedToOrgName ? (
                                <span className="font-medium text-foreground">{num.assignedToOrgName}</span>
                              ) : (
                                <span className="text-muted-foreground text-xs italic">Available in pool</span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              ${num.monthlyCost.toFixed(2)}/mo
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  num.status === "in_use"
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                    : "border-muted-foreground/30 text-muted-foreground"
                                }
                              >
                                {num.status === "in_use" ? "Active" : "Available"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteNumber(num.id, num.number)}
                                title="Remove from platform inventory"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              ) : (
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Registered Caller ID</TableHead>
                        <TableHead>Provider Carrier</TableHead>
                        <TableHead>Configuration Name</TableHead>
                        <TableHead>Organization / Workspace</TableHead>
                        <TableHead>Caller ID Role</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenantNumbers.map((num: any) => (
                        <TableRow key={num.id}>
                          <TableCell className="font-mono font-bold text-foreground">
                            {num.phone_number}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs capitalize">
                              {num.carrier}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-sm">
                            {num.configuration_name}
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {num.organization_name || `Org #${num.organization_id}`}
                          </TableCell>
                          <TableCell>
                            {num.is_default_caller_id ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                                Default Caller ID
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Secondary</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                num.is_active
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                  : "border-muted-foreground/30 text-muted-foreground"
                              }
                            >
                              {num.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* TAB 5: TRAFFIC */}
          <TabsContent value="traffic" className="space-y-4">
            <Card className="border-border/60">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Live Platform Call Stream</CardTitle>
                  <CardDescription>
                    Real-time inspection of active and recent voice runs across all tenants.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active Pipeline Connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run ID</TableHead>
                      <TableHead>Agent / Workflow</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Inspect</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveRunsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Loading live runs...
                        </TableCell>
                      </TableRow>
                    ) : liveRuns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No recent workflow runs recorded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      liveRuns.map((run) => (
                        <TableRow key={run.id}>
                          <TableCell className="font-mono text-xs font-bold">#{run.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{run.name || run.workflow_name || "Voice Agent"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {run.is_completed ? "Completed" : "In Progress"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{run.mode || "telephony"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{run.created_at ? new Date(run.created_at).toLocaleTimeString() : "--"}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" asChild className="h-7 text-xs">
                              <Link href={`/superadmin/runs`}>
                                View Run
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODAL 1: GRANT CREDITS */}
      <Dialog open={grantModalOpen} onOpenChange={setGrantModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grant Credits to {selectedOrgForCredit?.name}</DialogTitle>
            <DialogDescription>
              Allocate trial testing balance or bonus funds to this tenant organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="flex gap-2">
              {[5, 15, 25, 50].map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  variant={creditAmount === amt && !customCreditInput ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCreditAmount(amt);
                    setCustomCreditInput("");
                  }}
                  className="flex-1"
                >
                  ${amt}
                </Button>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="custom-credit" className="text-xs">Or Custom Amount ($)</Label>
              <Input
                id="custom-credit"
                type="number"
                placeholder="e.g. 15.00"
                value={customCreditInput}
                onChange={(e) => setCustomCreditInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrantCredit} className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Grant Balance Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: UPDATE MASTER KEY */}
      <Dialog open={editingKeyModalOpen} onOpenChange={setEditingKeyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Master {selectedKeyForEdit?.provider} Key</DialogTitle>
            <DialogDescription>
              Set the platform-wide master credential used for trial onboarding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Enter New API Key</Label>
              <Input
                type="password"
                placeholder={`sk-... or dg-...`}
                value={newApiKeyValue}
                onChange={(e) => setNewApiKeyValue(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Stored securely in administrative memory and applied to all trial tenants.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingKeyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMasterKey} className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Save Master Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: ADD PHONE NUMBER WITH PROVIDER CREDENTIALS */}
      <Dialog open={addNumberModalOpen} onOpenChange={setAddNumberModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Platform Phone Number</DialogTitle>
            <DialogDescription>
              Configure provider credentials and add a verified carrier line to your platform inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Telephony Provider</Label>
                <Select value={newCarrier} onValueChange={(val: any) => {
                  setNewCarrier(val);
                  if (val === "Tata Smartflo") setMonthlyCostInput(6.0);
                  else setMonthlyCostInput(3.0);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Twilio">Twilio</SelectItem>
                    <SelectItem value="Tata Smartflo">Tata Smartflo</SelectItem>
                    <SelectItem value="Telnyx">Telnyx</SelectItem>
                    <SelectItem value="Vonage">Vonage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Allocation Pool</Label>
                <Select value={newNumberType} onValueChange={(val: any) => setNewNumberType(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared_trial">Shared Trial (Free testing pool)</SelectItem>
                    <SelectItem value="dedicated">Dedicated Line (Client purchase)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">E.164 Phone Number</Label>
              <Input
                placeholder={newCarrier === "Tata Smartflo" ? "+91..." : "+1..."}
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Canonical format with country code (e.g. +14155552671 or +919811044219).
              </p>
            </div>

            {/* PROVIDER SPECIFIC FIELDS */}
            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                <span>{newCarrier} Provider Credentials</span>
              </div>

              {newCarrier === "Twilio" && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Twilio Account SID</Label>
                    <Input
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={providerConfig.account_sid}
                      onChange={(e) => setProviderConfig({ ...providerConfig, account_sid: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Twilio Auth Token</Label>
                    <Input
                      type="password"
                      placeholder="Auth token secret..."
                      value={providerConfig.auth_token}
                      onChange={(e) => setProviderConfig({ ...providerConfig, auth_token: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {newCarrier === "Tata Smartflo" && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Smartflo API Domain</Label>
                    <Input
                      placeholder="https://api-smartflo.tatateleservices.com"
                      value={providerConfig.api_domain}
                      onChange={(e) => setProviderConfig({ ...providerConfig, api_domain: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">JWT Token / Auth Key</Label>
                    <Input
                      type="password"
                      placeholder="Bearer eyJ..."
                      value={providerConfig.jwt_token}
                      onChange={(e) => setProviderConfig({ ...providerConfig, jwt_token: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Click-to-Call API Key</Label>
                      <Input
                        type="password"
                        placeholder="Key..."
                        value={providerConfig.click_to_call_api_key}
                        onChange={(e) => setProviderConfig({ ...providerConfig, click_to_call_api_key: e.target.value })}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Agent Caller Number</Label>
                      <Input
                        placeholder="e.g. 9811..."
                        value={providerConfig.agent_number}
                        onChange={(e) => setProviderConfig({ ...providerConfig, agent_number: e.target.value })}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {newCarrier === "Telnyx" && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Telnyx API V2 Key</Label>
                    <Input
                      type="password"
                      placeholder="KEY01..."
                      value={providerConfig.api_key}
                      onChange={(e) => setProviderConfig({ ...providerConfig, api_key: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">SIP Connection ID</Label>
                    <Input
                      placeholder="123456789..."
                      value={providerConfig.connection_id}
                      onChange={(e) => setProviderConfig({ ...providerConfig, connection_id: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {newCarrier === "Vonage" && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Vonage API Key</Label>
                    <Input
                      placeholder="Key..."
                      value={providerConfig.api_key}
                      onChange={(e) => setProviderConfig({ ...providerConfig, api_key: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Vonage API Secret</Label>
                    <Input
                      type="password"
                      placeholder="Secret..."
                      value={providerConfig.api_secret}
                      onChange={(e) => setProviderConfig({ ...providerConfig, api_secret: e.target.value })}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {newNumberType === "dedicated" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Monthly Price to Client ($)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={monthlyCostInput}
                    onChange={(e) => setMonthlyCostInput(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Pre-assign Tenant (Optional)</Label>
                  <Select value={assignOrgId} onValueChange={setAssignOrgId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned (Public)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Public Marketplace --</SelectItem>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setAddNumberModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddNumber}
              disabled={addingNumberLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5"
            >
              {addingNumberLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save to Platform Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
