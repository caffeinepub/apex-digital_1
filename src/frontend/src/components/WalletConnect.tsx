import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useEvmWallet } from "../hooks/useEvmWallet";
import WalletPickerModal from "./WalletPickerModal";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function WalletConnect() {
  const { address, isConnected, isConnecting, connect, disconnect } =
    useEvmWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!isConnected) {
    return (
      <>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          disabled={isConnecting}
          className="font-mono-label text-xs border border-orange text-orange px-4 py-2 hover:bg-orange/10 transition-colors duration-200 disabled:opacity-50"
          data-ocid="wallet.primary_button"
        >
          {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
        </button>
        <WalletPickerModal
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelectMetaMask={connect}
          isConnecting={isConnecting}
        />
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        className="font-mono-label text-xs border border-orange text-orange px-4 py-2 hover:bg-orange/10 transition-colors duration-200 flex items-center gap-2"
        data-ocid="wallet.toggle"
      >
        <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
        {address ? truncateAddress(address) : ""}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-[oklch(0.12_0_0)] border border-[oklch(0.22_0_0)] z-50 p-4 flex flex-col gap-3"
            data-ocid="wallet.dropdown_menu"
          >
            <p className="font-mono-label text-xs text-muted-foreground">
              CONNECTED WALLET
            </p>
            <p className="font-mono text-xs text-foreground break-all">
              {address}
            </p>
            <button
              type="button"
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
              className="font-mono-label text-xs border border-[oklch(0.3_0_0)] text-muted-foreground px-4 py-2 hover:border-orange hover:text-orange transition-colors duration-200 w-full"
              data-ocid="wallet.close_button"
            >
              DISCONNECT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
