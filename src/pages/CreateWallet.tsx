import { useState, FC, useEffect } from "react";
import { useWalletStore } from "../store/walletStore";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { useNavigate } from "react-router-dom";
import load, { Mnemonic, encryptXChaCha20Poly1305 } from "../../wasm";

export const CreateWallet: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [mnemonic, setMnemonic] = useState<string[]>(Array(24).fill(""));
  const [initMnemonic, setInitMnemonic] = useState<string>("");
  const password = useWalletStore((state) => state.password);

  useEffect(() => {
    load().then(() => {
      setLoading(false);
    });
  }, []);

  const generateWallet = () => {
    if (!loading) {
      const { phrase } = Mnemonic.random(24);
      console.log(`kek init mnemonick`, { phrase });
      setInitMnemonic(phrase);
      setMnemonic(phrase.split(" "));
    }
  };

  const confirmWallet = () => {
    console.log(`kek confirm`, initMnemonic, password);
    localStorage.setItem(
      "key",
      encryptXChaCha20Poly1305(initMnemonic, password),
    );
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Create Wallet</h1>
      <Button isDisabled={loading} onClick={generateWallet}>
        Generate
      </Button>
      <div className="grid grid-cols-4 gap-2">
        {mnemonic.map((word, index) => (
          <Input
            key={index}
            type="text"
            value={word}
            readOnly
            className="p-2"
          />
        ))}
      </div>
      <Button
        isDisabled={loading}
        onClick={() => navigator.clipboard.writeText(mnemonic.join(" "))}
      >
        Copy
      </Button>
      <Button isDisabled={loading} onClick={confirmWallet}>
        Confirm
      </Button>
    </div>
  );
};
