import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface WalletPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMetaMask: () => void;
  isConnecting?: boolean;
}

export default function WalletPickerModal({
  open,
  onOpenChange,
  onSelectMetaMask,
  isConnecting,
}: WalletPickerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#0a0a0a] border border-[oklch(0.22_0_0)] rounded-none p-0 max-w-sm"
        style={{ fontFamily: "inherit" }}
        data-ocid="wallet.dialog"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[oklch(0.18_0_0)]">
          <DialogTitle className="font-mono text-xs tracking-widest text-[#FF5C00] uppercase">
            CONNECT WALLET
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-6">
          {/* MetaMask option */}
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onSelectMetaMask();
            }}
            disabled={isConnecting}
            className="w-full flex items-center gap-4 border border-[oklch(0.28_0_0)] hover:border-[#FF5C00] bg-transparent text-left px-4 py-4 transition-colors duration-200 group disabled:opacity-50"
            data-ocid="wallet.metamask_button"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-[oklch(0.14_0_0)] border border-[oklch(0.22_0_0)] shrink-0">
              <svg
                viewBox="0 0 35 33"
                width="22"
                height="22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M32.9582 1L19.4473 10.7183L21.9573 4.99099L32.9582 1Z"
                  fill="#E17726"
                  stroke="#E17726"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.04858 1L15.4383 10.809L13.0491 4.99099L2.04858 1Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.2292 23.5334L24.7346 28.872L32.2451 30.9323L34.4036 23.6501L28.2292 23.5334Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0.608398 23.6501L2.75458 30.9323L10.2542 28.872L6.77182 23.5334L0.608398 23.6501Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.85336 14.6681L7.75439 17.8308L15.1867 18.1642L14.9322 10.1505L9.85336 14.6681Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25.1531 14.6681L20.0052 10.0605L19.8398 18.1642L27.2503 17.8308L25.1531 14.6681Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.2542 28.872L14.7252 26.6942L10.8604 23.7034L10.2542 28.872Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.2812 26.6942L24.7346 28.872L24.1459 23.7034L20.2812 26.6942Z"
                  fill="#E27625"
                  stroke="#E27625"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs tracking-widest text-white group-hover:text-[#FF5C00] transition-colors">
                METAMASK
              </p>
              <p className="font-mono text-[10px] text-[oklch(0.5_0_0)] mt-0.5">
                Connect via browser extension
              </p>
            </div>
          </button>

          {/* WalletConnect placeholder */}
          <div
            className="w-full flex items-center gap-4 border border-[oklch(0.2_0_0)] bg-transparent px-4 py-4 opacity-50 cursor-not-allowed"
            data-ocid="wallet.walletconnect_button"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-[oklch(0.14_0_0)] border border-[oklch(0.22_0_0)] shrink-0">
              <svg
                viewBox="0 0 40 25"
                width="22"
                height="14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8.19 5.41C14.69-1.09 25.31-1.09 31.81 5.41L32.61 6.21C32.94 6.54 32.94 7.08 32.61 7.41L30.16 9.86C30 10.02 29.73 10.02 29.57 9.86L28.49 8.78C23.92 4.21 16.08 4.21 11.51 8.78L10.35 9.94C10.19 10.1 9.92 10.1 9.76 9.94L7.31 7.49C6.98 7.16 6.98 6.62 7.31 6.29L8.19 5.41ZM37.39 10.99L39.58 13.18C39.91 13.51 39.91 14.05 39.58 14.38L29.97 23.99C29.64 24.32 29.1 24.32 28.77 23.99L21.98 17.2C21.9 17.12 21.76 17.12 21.68 17.2L14.89 23.99C14.56 24.32 14.02 24.32 13.69 23.99L4.08 14.38C3.75 14.05 3.75 13.51 4.08 13.18L6.27 10.99C6.6 10.66 7.14 10.66 7.47 10.99L14.26 17.78C14.34 17.86 14.48 17.86 14.56 17.78L21.35 10.99C21.68 10.66 22.22 10.66 22.55 10.99L29.34 17.78C29.42 17.86 29.56 17.86 29.64 17.78L36.43 10.99C36.56 10.66 37.06 10.66 37.39 10.99Z"
                  fill="#3B99FC"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs tracking-widest text-[oklch(0.5_0_0)]">
                  WALLETCONNECT
                </p>
                <span className="font-mono text-[9px] tracking-wider border border-[oklch(0.3_0_0)] text-[oklch(0.45_0_0)] px-1.5 py-0.5">
                  SOON
                </span>
              </div>
              <div className="flex items-start gap-1 mt-0.5">
                <Info className="w-2.5 h-2.5 text-[oklch(0.4_0_0)] mt-[1px] shrink-0" />
                <p className="font-mono text-[10px] text-[oklch(0.4_0_0)] leading-tight">
                  Add your WalletConnect Project ID to enable
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
