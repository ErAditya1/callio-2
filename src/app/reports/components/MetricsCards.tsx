import { HugeiconsIcon } from "@hugeicons/react";
import {
  PhoneForwardedIcon,
  PhoneIcon,
} from "@hugeicons/core-free-icons";;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricsCardsProps {
  metrics: {
    total_runs: number;
    xfer_count: number;
  };
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workflow Runs</CardTitle>
          <HugeiconsIcon icon={PhoneIcon} className="h-4 w-4 text-[#737373]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total_runs.toLocaleString()}</div>
          <p className="text-xs text-[#737373]">
            Total calls processed today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transfer Dispositions</CardTitle>
          <HugeiconsIcon icon={PhoneForwardedIcon} className="h-4 w-4 text-[#737373]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.xfer_count.toLocaleString()}</div>
          <p className="text-xs text-[#737373]">
            Calls transferred (XFER)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
