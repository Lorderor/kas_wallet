import { Input } from "../components/Input";
import {useNavigate} from "react-router-dom";
import {useWalletStore} from "../store/walletStore.ts";
import {FC, useCallback, useState} from "react";
import {Button} from "../components/Button.tsx";
import load, { Mnemonic, encryptXChaCha20Poly1305 } from "../../wasm";

export const ImportWallet: FC = () => {
    const navigate = useNavigate();
    const [mnemonic, setMnemonic] = useState<string[]>(Array(24).fill(""));
    const password = useWalletStore((state) => state.password);

    const importWallet = (): void => {
        const mnemonicPhrase = mnemonic.join(' ');
        console.log(`kek Mnemonic`,mnemonicPhrase, { mnemonicPhrase },mnemonic);
        load().then(() => {
            if (Mnemonic.validate(mnemonicPhrase)) {
                console.log(`kek confirm`, mnemonicPhrase, password);
                localStorage.setItem(
                    "key",
                    encryptXChaCha20Poly1305(mnemonicPhrase, password),
                );
                navigate("/dashboard");
            } else {
                alert("Invalid mnemonic!");
            }
        })

    };

    const handlePasted = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        const words = e.clipboardData.getData('text').split(' ')

        if (words.length === 24) {
            setMnemonic(words)
            e.preventDefault()
            e.currentTarget.blur()
        }
    }, [])

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold">Import Wallet</h1>
            <div className="grid grid-cols-4 gap-2">
                {mnemonic.map((word, index) => (
                    <Input
                        key={index}
                        type="text"
                        value={word}
                        onChange={(e) => {
                            const newMnemonic = [...mnemonic];
                            newMnemonic[index] = e.target.value;
                            setMnemonic(newMnemonic);
                        }}
                        onPaste={handlePasted}
                        className="p-2"
                    />
                ))}
            </div>
            <Button onClick={importWallet}>Import</Button>
        </div>
    );
};