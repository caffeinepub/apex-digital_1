import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface EvmWalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  isMetaMaskInstalled: boolean;
  walletType: "metamask" | "walletconnect" | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useEvmWallet(): EvmWalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<
    "metamask" | "walletconnect" | null
  >(null);

  const isMetaMaskInstalled =
    typeof window !== "undefined" && !!window.ethereum;

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed.");
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chain: string = await window.ethereum.request({
        method: "eth_chainId",
      });
      setAddress(accounts[0] ?? null);
      setChainId(chain);
      setWalletType("metamask");
    } catch (err: any) {
      setError(err?.message ?? "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setError(null);
    setWalletType(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0] ?? null);
      if (!accounts[0]) {
        setChainId(null);
        setWalletType(null);
      }
    };

    const handleChainChanged = (chain: string) => {
      setChainId(chain);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return {
    address,
    chainId,
    isConnected: !!address,
    isConnecting,
    error,
    isMetaMaskInstalled,
    walletType,
    connect,
    disconnect,
  };
}
