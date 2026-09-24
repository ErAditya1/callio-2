import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContextDisplayProps {
    title: string;
    context: Record<string, string | number | boolean | object> | null;
}

export const ContextDisplay = ({ title, context }: ContextDisplayProps) => {
    if (!context || Object.keys(context).length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-[#737373]">No {title.toLowerCase()} available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {Object.entries(context).map(([key, value]) => {
                    if (key === "answer_supervisor" && Array.isArray(value)) {
                        return (
                            <div key={key} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-foreground">
                                        Voice Pickup &amp; AMD Timeline ({key})
                                    </label>
                                    <span className="text-xs text-muted-foreground font-mono">{value.length} event(s)</span>
                                </div>
                                <div className="space-y-2">
                                    {value.map((ev: any, idx: number) => {
                                        const elapsed = typeof ev.elapsed_ms === "number" ? `+${(ev.elapsed_ms / 1000).toFixed(2)}s` : null;
                                        return (
                                            <div key={idx} className="p-3 bg-muted/40 border rounded-md space-y-1.5 text-xs">
                                                <div className="flex items-center justify-between flex-wrap gap-1">
                                                    <div className="flex items-center gap-2">
                                                        {elapsed && (
                                                            <span className="font-mono font-bold bg-background px-1.5 py-0.5 rounded border text-[11px]">
                                                                {elapsed}
                                                            </span>
                                                        )}
                                                        <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                                                            {String(ev.action || "checkpoint").replace(/_/g, " ")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {ev.subtype && (
                                                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold">
                                                                {ev.subtype}
                                                            </span>
                                                        )}
                                                        {ev.strategy && (
                                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                                {ev.strategy}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-[11px]">
                                                    Reason: <strong className="text-foreground">{String(ev.reason || "").replace(/_/g, " ")}</strong>
                                                </p>
                                                {ev.transcript && (
                                                    <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded text-emerald-950 text-xs font-semibold">
                                                        Caller Utterance: &ldquo;{ev.transcript}&rdquo;
                                                        {typeof ev.duration_ms === "number" && (
                                                            <span className="text-emerald-700 font-mono text-[10px] ml-1.5">
                                                                ({ev.duration_ms}ms)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={key} className="space-y-1">
                            <label className="text-sm font-medium text-[#737373]">
                                {key}
                            </label>
                            <div className="p-3 bg-[#F7F7F7] border rounded-md">
                                <p className="text-sm whitespace-pre-wrap">
                                    {typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : (value || 'No value')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
