import { useCallback, useEffect, useState } from "react";

export interface ICPStats {
  status: "OPERATIONAL" | "DEGRADED" | "LOADING";
  nodeCount: number | null;
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

export function useICPStats(refreshMs = 30_000): ICPStats {
  const [stats, setStats] = useState<ICPStats>({
    status: "LOADING",
    nodeCount: null,
    subnetCount: null,
    blocksFinalized: null,
    icpPrice: null,
  });

  const load = useCallback(async () => {
    try {
      const [nodes, subnets, metrics] = await Promise.allSettled([
        fetchJSON(`${BASE}/node-count`),
        fetchJSON(`${BASE}/subnet-count`),
        fetchJSON(`${BASE}/metrics`),
      ]);

      const nodeCount =
        nodes.status === "fulfilled" ? (nodes.value?.count ?? null) : null;
      const subnetCount =
        subnets.status === "fulfilled" ? (subnets.value?.count ?? null) : null;

      let blocksFinalized: number | null = null;
      let icpPrice: number | null = null;
      if (metrics.status === "fulfilled") {
        const m = metrics.value;
        if (Array.isArray(m?.block_height_per_subnet)) {
          blocksFinalized = m.block_height_per_subnet.reduce(
            (sum: number, s: { block_height: number }) =>
              sum + (s.block_height ?? 0),
            0,
          );
        } else if (typeof m?.block_height === "number") {
          blocksFinalized = m.block_height;
        }
        if (typeof m?.icp_price === "number") {
          icpPrice = m.icp_price;
        }
      }

      setStats({
        status:
          nodeCount !== null || subnetCount !== null
            ? "OPERATIONAL"
            : "DEGRADED",
        nodeCount,
        subnetCount,
        blocksFinalized,
        icpPrice,
      });
    } catch {
      setStats((prev) => ({ ...prev, status: "DEGRADED" }));
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => clearInterval(id);
  }, [load, refreshMs]);

  return stats;
}
