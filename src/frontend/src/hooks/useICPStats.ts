import { useCallback, useEffect, useState } from "react";

export interface ICPStats {
  status: "OPERATIONAL" | "DEGRADED" | "LOADING";
  canisterCount: number | null;
  subnetCount: number | null;
  blocksFinalized: number | null;
  icpPrice: number | null;
}

const BASE = "https://ic-api.internetcomputer.org/api/v3";

async function fetchJSON(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function lastValue(pairs: [number, string][] | undefined): number | null {
  if (!Array.isArray(pairs) || pairs.length === 0) return null;
  const last = pairs[pairs.length - 1];
  if (!Array.isArray(last) || last.length < 2) return null;
  const v = Number.parseFloat(last[1]);
  return Number.isFinite(v) ? v : null;
}

export function useICPStats(refreshMs = 30_000): ICPStats {
  const [stats, setStats] = useState<ICPStats>({
    status: "LOADING",
    canisterCount: null,
    subnetCount: null,
    blocksFinalized: null,
    icpPrice: null,
  });

  const load = useCallback(async () => {
    const [canistersRes, subnetsRes, blocksRes, priceRes] =
      await Promise.allSettled([
        fetchJSON(`${BASE}/metrics/registered-canisters-count`),
        fetchJSON(`${BASE}/metrics/ic-subnet-total`),
        fetchJSON(`${BASE}/metrics/block-count`),
        fetchJSON(`${BASE}/icp-usd-rate`),
      ]);

    const canisterCount =
      canistersRes.status === "fulfilled"
        ? (() => {
            const running = lastValue(canistersRes.value?.running_canisters);
            const stopped = lastValue(canistersRes.value?.stopped_canisters);
            if (running === null && stopped === null) return null;
            return (running ?? 0) + (stopped ?? 0);
          })()
        : null;

    const subnetCount =
      subnetsRes.status === "fulfilled"
        ? lastValue(subnetsRes.value?.ic_subnet_total)
        : null;

    const blocksFinalized =
      blocksRes.status === "fulfilled"
        ? lastValue(blocksRes.value?.block_count)
        : null;

    const icpPrice =
      priceRes.status === "fulfilled"
        ? lastValue(priceRes.value?.icp_usd_rate)
        : null;

    const anyLoaded =
      canisterCount !== null ||
      subnetCount !== null ||
      blocksFinalized !== null ||
      icpPrice !== null;

    setStats({
      status: anyLoaded ? "OPERATIONAL" : "DEGRADED",
      canisterCount,
      subnetCount,
      blocksFinalized,
      icpPrice,
    });
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => clearInterval(id);
  }, [load, refreshMs]);

  return stats;
}
