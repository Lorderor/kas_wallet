import { create } from "zustand";
import { RpcClient, Mnemonic } from "../../wasm";

interface WalletStore {
  rpcClient: RpcClient | null;
  mnemonic: Mnemonic | null;
  balance: number;
  password: string;
  createMode: "create" | "import" | null;
  setRpcClient: (rpcClient: RpcClient) => void;
  setPassword: (password: string) => void;
  setCreateMode: (createMode: "create" | "import" | null) => void;
  setBalance: (balance: number) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  rpcClient: null,
  mnemonic: null,
  balance: 0,
  password: "",
  createMode: null,
  setRpcClient: (rpcClient) => set({ rpcClient }),
  setCreateMode: (createMode) => set({ createMode }),
  setPassword: (password) => set({ password }),
  setBalance: (balance) => set({ balance }),
  reset: () => set({ rpcClient: null, balance: 0 }),
}));
