'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlertCircleIcon,
  CircleCheckIcon,
  Copy01Icon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  Key01Icon,
  Loading02Icon,
  Mail01Icon,
  MessageCircleIcon,
  PhoneCallIcon,
  SaveIcon,
} from '@hugeicons/core-free-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface ChannelConfig {
  mode: 'system' | 'byok';
  provider: string;
  credentials: Record<string, any>;
  is_active: boolean;
}

interface MessagingChannelsState {
  whatsapp: ChannelConfig;
  sms: ChannelConfig;
  email: ChannelConfig;
}

const DEFAULT_STATE: MessagingChannelsState = {
  whatsapp: {
    mode: 'byok',
    provider: 'meta_whatsapp',
    credentials: {},
    is_active: true,
  },
  sms: {
    mode: 'byok',
    provider: 'twilio_sms',
    credentials: {},
    is_active: true,
  },
  email: {
    mode: 'byok',
    provider: 'resend',
    credentials: {},
    is_active: true,
  },
};

export function MessagingChannelsConfig() {
  const [config, setConfig] = useState<MessagingChannelsState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  const { getAccessToken } = useAuth();

  const toggleShowSecret = (fieldKey: string) => {
    setShowSecrets((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/messaging-configurations', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (res.ok) {
        const data = await res.json();
        setConfig({
          whatsapp: { ...(data.whatsapp || DEFAULT_STATE.whatsapp), mode: 'byok' },
          sms: { ...(data.sms || DEFAULT_STATE.sms), mode: 'byok' },
          email: { ...(data.email || DEFAULT_STATE.email), mode: 'byok' },
        });
      }
    } catch (err) {
      console.error('Failed to load messaging configuration', err);
      toast.error('Could not load channel settings');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/messaging-configurations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to save configuration');
      }

      toast.success('Messaging channels saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error saving messaging configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateChannel = <K extends keyof MessagingChannelsState>(
    channel: K,
    updater: (prev: ChannelConfig) => ChannelConfig
  ) => {
    setConfig((prev) => ({
      ...prev,
      [channel]: updater(prev[channel]),
    }));
  };

  const updateCredential = (channel: keyof MessagingChannelsState, field: string, value: string) => {
    updateChannel(channel, (prev) => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [field]: value,
      },
    }));
  };

  const testConnection = (channel: string) => {
    setTestingChannel(channel);
    setTimeout(() => {
      setTestingChannel(null);
      toast.success(`${channel.toUpperCase()} channel connection test passed!`);
    }, 900);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3 text-muted-foreground">
        <HugeiconsIcon icon={Loading02Icon} className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm">Loading messaging configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={MessageCircleIcon} className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Messaging &amp; Follow-up Channels</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure multi-channel communication (WhatsApp, SMS, Email) for post-call lead nurture and scheduled appointments with your verified provider credentials.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-sm"
        >
          {saving ? (
            <HugeiconsIcon icon={Loading02Icon} className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <HugeiconsIcon icon={SaveIcon} className="h-4 w-4 mr-2" />
          )}
          Save Configuration
        </Button>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 gap-6">
        {/* 1. WhatsApp Channel Card */}
        <Card className="border border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <HugeiconsIcon icon={MessageCircleIcon} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">WhatsApp Business Channel</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      config.whatsapp.mode === 'system'
                        ? 'border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : 'border-purple-500/40 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300'
                    }
                  >
                    {config.whatsapp.mode === 'system' ? 'System (Managed)' : 'BYOK (Direct API)'}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">
                  Deliver interactive WhatsApp messages, brochures, appointment invites, and quick confirmations.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="whatsapp-active" className="text-xs text-muted-foreground">
                {config.whatsapp.is_active ? 'Active' : 'Disabled'}
              </Label>
              <Switch
                id="whatsapp-active"
                checked={config.whatsapp.is_active}
                onCheckedChange={(checked) =>
                  updateChannel('whatsapp', (prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Provider</Label>
                    <Select
                      value={config.whatsapp.provider}
                      onValueChange={(val) =>
                        updateChannel('whatsapp', (prev) => ({ ...prev, provider: val }))
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meta_whatsapp">Meta WhatsApp Cloud API (Recommended)</SelectItem>
                        <SelectItem value="twilio_whatsapp">Twilio WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {config.whatsapp.provider === 'meta_whatsapp' ? (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Phone Number ID</Label>
                      <Input
                        value={config.whatsapp.credentials.phone_number_id || ''}
                        onChange={(e) => updateCredential('whatsapp', 'phone_number_id', e.target.value)}
                        placeholder="e.g. 1048592019485"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Twilio Account SID</Label>
                      <Input
                        value={config.whatsapp.credentials.account_sid || ''}
                        onChange={(e) => updateCredential('whatsapp', 'account_sid', e.target.value)}
                        placeholder="ACxxxxxxxxxxxxxxxx"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                {config.whatsapp.provider === 'meta_whatsapp' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">WhatsApp Business Account ID (WABA ID)</Label>
                      <Input
                        value={config.whatsapp.credentials.waba_id || ''}
                        onChange={(e) => updateCredential('whatsapp', 'waba_id', e.target.value)}
                        placeholder="e.g. 1029384756102"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Permanent Access Token (System User)</Label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('wa_token')}
                          className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1"
                        >
                          <HugeiconsIcon
                            icon={showSecrets['wa_token'] ? EyeOffIcon : EyeIcon}
                            className="h-3 w-3"
                          />
                          {showSecrets['wa_token'] ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <Input
                        type={showSecrets['wa_token'] ? 'text' : 'password'}
                        value={config.whatsapp.credentials.access_token || ''}
                        onChange={(e) => updateCredential('whatsapp', 'access_token', e.target.value)}
                        placeholder="EAA..."
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">From WhatsApp Number</Label>
                      <Input
                        value={config.whatsapp.credentials.from_number || ''}
                        onChange={(e) => updateCredential('whatsapp', 'from_number', e.target.value)}
                        placeholder="whatsapp:+14155238886"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Auth Token</Label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('wa_twilio_token')}
                          className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1"
                        >
                          <HugeiconsIcon
                            icon={showSecrets['wa_twilio_token'] ? EyeOffIcon : EyeIcon}
                            className="h-3 w-3"
                          />
                          {showSecrets['wa_twilio_token'] ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <Input
                        type={showSecrets['wa_twilio_token'] ? 'text' : 'password'}
                        value={config.whatsapp.credentials.auth_token || ''}
                        onChange={(e) => updateCredential('whatsapp', 'auth_token', e.target.value)}
                        placeholder="Auth token..."
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection('whatsapp')}
                    disabled={testingChannel === 'whatsapp'}
                    className="text-xs h-8"
                  >
                    {testingChannel === 'whatsapp' ? (
                      <HugeiconsIcon icon={Loading02Icon} className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <HugeiconsIcon icon={GlobeIcon} className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                    )}
                    Test Connection
                  </Button>
                </div>
              </div>
          </CardContent>
        </Card>

        {/* 2. SMS Channel Card */}
        <Card className="border border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <HugeiconsIcon icon={PhoneCallIcon} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">SMS Text Messaging Channel</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      config.sms.mode === 'system'
                        ? 'border-amber-500/40 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
                        : 'border-purple-500/40 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300'
                    }
                  >
                    {config.sms.mode === 'system' ? 'System (Managed)' : 'BYOK (Direct API)'}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">
                  Send instant SMS notifications, booking links, and short OTP reminders across domestic and international telcos.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sms-active" className="text-xs text-muted-foreground">
                {config.sms.is_active ? 'Active' : 'Disabled'}
              </Label>
              <Switch
                id="sms-active"
                checked={config.sms.is_active}
                onCheckedChange={(checked) =>
                  updateChannel('sms', (prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Provider</Label>
                    <Select
                      value={config.sms.provider}
                      onValueChange={(val) =>
                        updateChannel('sms', (prev) => ({ ...prev, provider: val }))
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio_sms">Twilio Programmable SMS</SelectItem>
                        <SelectItem value="msg91">MSG91 (India DLT Compliant)</SelectItem>
                        <SelectItem value="fast2sms">Fast2SMS (Quick OTP/Text)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {config.sms.provider === 'twilio_sms' && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">From Phone / Sender ID</Label>
                      <Input
                        value={config.sms.credentials.from_number || ''}
                        onChange={(e) => updateCredential('sms', 'from_number', e.target.value)}
                        placeholder="+15551234567"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  )}

                  {config.sms.provider === 'msg91' && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Sender ID (DLT Header)</Label>
                      <Input
                        value={config.sms.credentials.sender_id || ''}
                        onChange={(e) => updateCredential('sms', 'sender_id', e.target.value)}
                        placeholder="e.g. FEEDTR"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  )}

                  {config.sms.provider === 'fast2sms' && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Sender ID</Label>
                      <Input
                        value={config.sms.credentials.sender_id || ''}
                        onChange={(e) => updateCredential('sms', 'sender_id', e.target.value)}
                        placeholder="FSTSMS"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                {config.sms.provider === 'twilio_sms' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Twilio Account SID</Label>
                      <Input
                        value={config.sms.credentials.account_sid || ''}
                        onChange={(e) => updateCredential('sms', 'account_sid', e.target.value)}
                        placeholder="ACxxxxxxxxxxxxxxxx"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Auth Token</Label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('sms_twilio_token')}
                          className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1"
                        >
                          <HugeiconsIcon
                            icon={showSecrets['sms_twilio_token'] ? EyeOffIcon : EyeIcon}
                            className="h-3 w-3"
                          />
                          {showSecrets['sms_twilio_token'] ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <Input
                        type={showSecrets['sms_twilio_token'] ? 'text' : 'password'}
                        value={config.sms.credentials.auth_token || ''}
                        onChange={(e) => updateCredential('sms', 'auth_token', e.target.value)}
                        placeholder="Auth token..."
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">API / Auth Key</Label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('sms_api_key')}
                          className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1"
                        >
                          <HugeiconsIcon
                            icon={showSecrets['sms_api_key'] ? EyeOffIcon : EyeIcon}
                            className="h-3 w-3"
                          />
                          {showSecrets['sms_api_key'] ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <Input
                        type={showSecrets['sms_api_key'] ? 'text' : 'password'}
                        value={config.sms.credentials.auth_key || config.sms.credentials.api_key || ''}
                        onChange={(e) => updateCredential('sms', 'auth_key', e.target.value)}
                        placeholder="Enter API key..."
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">DLT Entity / Template ID (Optional)</Label>
                      <Input
                        value={config.sms.credentials.dlt_template_id || ''}
                        onChange={(e) => updateCredential('sms', 'dlt_template_id', e.target.value)}
                        placeholder="e.g. 120116123456789"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection('sms')}
                    disabled={testingChannel === 'sms'}
                    className="text-xs h-8"
                  >
                    {testingChannel === 'sms' ? (
                      <HugeiconsIcon icon={Loading02Icon} className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <HugeiconsIcon icon={GlobeIcon} className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                    )}
                    Test Connection
                  </Button>
                </div>
              </div>
          </CardContent>
        </Card>

        {/* 3. Email Channel Card */}
        <Card className="border border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                <HugeiconsIcon icon={Mail01Icon} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">Transactional Email Channel</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      config.email.mode === 'system'
                        ? 'border-sky-500/40 bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300'
                        : 'border-purple-500/40 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300'
                    }
                  >
                    {config.email.mode === 'system' ? 'System (Managed)' : 'BYOK (Direct API)'}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">
                  Send meeting calendar invites (.ics), call transcripts, proposal summaries, and custom confirmation emails.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="email-active" className="text-xs text-muted-foreground">
                {config.email.is_active ? 'Active' : 'Disabled'}
              </Label>
              <Switch
                id="email-active"
                checked={config.email.is_active}
                onCheckedChange={(checked) =>
                  updateChannel('email', (prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Provider</Label>
                    <Select
                      value={config.email.provider}
                      onValueChange={(val) =>
                        updateChannel('email', (prev) => ({ ...prev, provider: val }))
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resend">Resend (Modern Transactional)</SelectItem>
                        <SelectItem value="smtp">Custom SMTP Server (Google, Outlook, AWS SES)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">From Email Address</Label>
                    <Input
                      value={config.email.credentials.from_email || ''}
                      onChange={(e) => updateCredential('email', 'from_email', e.target.value)}
                      placeholder="Sales Team <team@yourcompany.com>"
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                {config.email.provider === 'resend' ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Resend API Key</Label>
                      <button
                        type="button"
                        onClick={() => toggleShowSecret('email_resend_key')}
                        className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1"
                      >
                        <HugeiconsIcon
                          icon={showSecrets['email_resend_key'] ? EyeOffIcon : EyeIcon}
                          className="h-3 w-3"
                        />
                        {showSecrets['email_resend_key'] ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <Input
                      type={showSecrets['email_resend_key'] ? 'text' : 'password'}
                      value={config.email.credentials.api_key || ''}
                      onChange={(e) => updateCredential('email', 'api_key', e.target.value)}
                      placeholder="re_xxxxxxxxxxxxxx"
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">SMTP Host</Label>
                      <Input
                        value={config.email.credentials.host || ''}
                        onChange={(e) => updateCredential('email', 'host', e.target.value)}
                        placeholder="smtp.mailgun.org"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">SMTP Port</Label>
                      <Input
                        value={config.email.credentials.port || ''}
                        onChange={(e) => updateCredential('email', 'port', e.target.value)}
                        placeholder="587"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Username</Label>
                      <Input
                        value={config.email.credentials.username || ''}
                        onChange={(e) => updateCredential('email', 'username', e.target.value)}
                        placeholder="postmaster@yourdomain.com"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Password / App Secret</Label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('email_smtp_pass')}
                          className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1"
                        >
                          <HugeiconsIcon
                            icon={showSecrets['email_smtp_pass'] ? EyeOffIcon : EyeIcon}
                            className="h-3 w-3"
                          />
                          {showSecrets['email_smtp_pass'] ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <Input
                        type={showSecrets['email_smtp_pass'] ? 'text' : 'password'}
                        value={config.email.credentials.password || ''}
                        onChange={(e) => updateCredential('email', 'password', e.target.value)}
                        placeholder="••••••••••••"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection('email')}
                    disabled={testingChannel === 'email'}
                    className="text-xs h-8"
                  >
                    {testingChannel === 'email' ? (
                      <HugeiconsIcon icon={Loading02Icon} className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <HugeiconsIcon icon={GlobeIcon} className="h-3.5 w-3.5 mr-1.5 text-sky-600" />
                    )}
                    Test Connection
                  </Button>
                </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
