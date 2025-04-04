import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { useWalletStore } from "../store/walletStore.ts";

export const Main: FC = () => {
  const setCreateMode = useWalletStore((state) => state.setCreateMode);

  const navigate = useNavigate();


  const onCreate = () => {
    setCreateMode("create");
    navigate("/password");
  };
  const onImport = () => {
    setCreateMode("import");
    navigate("/password");
  };
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Kaspa Wallet</h1>
      <Button onClick={onCreate}>Create Wallet</Button>
      <Button onClick={onImport}>Import Wallet</Button>
    </div>
  );
};
