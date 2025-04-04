import { FC, useEffect, useState } from "react";
import { useWalletStore } from "../store/walletStore.ts";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input.tsx";
import { Button } from "../components/Button.tsx";
import load, {
  Wallet,
  UtxoProcessor,
  UtxoContext,
  Resolver,
  NetworkId,
  Mnemonic,
  decryptXChaCha20Poly1305,
  XPrv,
  PublicKeyGenerator,
  RpcClient,
} from "../../wasm";

export const Dashboard: FC = () => {
  const { balance, password, reset, setBalance } = useWalletStore();
  const [sendTo, setSendTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");

  const [events, setEvents] = useState(0); // Состояние для отслеживания количества событий
  const [processor, setProcessor] = useState<UtxoProcessor | null>(null);
  const [context, setContext] = useState<UtxoContext | null>(null);

  useEffect(() => {
    load().then(() => {
      setLoading(false);
      const w = new Wallet({
        resolver: new Resolver(),
        networkId: new NetworkId("mainnet"),
      });
      w.connect().then(() => {
      console.log("Connected to", w.rpc.url);
              const key = localStorage.getItem("key");
              console.log(`kek`, { key });
              if (key) {
                const d = decryptXChaCha20Poly1305(key, password);
                console.log(`kek key`, d);

                const mnemonic = new Mnemonic(d);
                const extendedKey = new XPrv(mnemonic.toSeed());
                const addressPublic = PublicKeyGenerator.fromMasterXPrv(
                  extendedKey,
                  false,
                  BigInt(1),
                );
                const addressPublic1 = PublicKeyGenerator.fromXPub(
                  addressPublic.toString(),
                );
                if (addressPublic) {
                  console.log(
                    `kek publick key`,
                    addressPublic.receiveAddressAsStrings("mainnet", 0, 1),
                    addressPublic1.receiveAddressAsStrings("mainnet", 0, 1),
                  );
                  setAddress(
                    addressPublic.receiveAddressAsStrings("mainnet", 0, 1)[0],
                  );
                }
              }

              const monitorProcessor = new UtxoProcessor({
                rpc: w.rpc,
                networkId: "mainnet",
              });
              monitorProcessor.start().then(() => {
                setProcessor(monitorProcessor); // Сохраняем processor

                const monitorContext = new UtxoContext({
                  processor: monitorProcessor,
                });
                setContext(monitorContext); // Сохраняем context
                console.log(`kek monitorContext`, monitorContext);
                monitorProcessor.addEventListener((event) => {
                  setEvents((prevEvents) => prevEvents + 1); // Увеличиваем количество событий
                  console.log("event:", event);
                });
              });

            });


    })
    //   console.log(`kek w`,w,)
    //   const rpc = new RpcClient();
    //   if (rpc) {
    //     console.log(`kek 1`);
    //     rpc?.setResolver(new Resolver());
    //     rpc?.setNetworkId(new NetworkId("mainnet"));
    //     rpc.connect().then(async () => {
    //     //   console.log("Connected to", rpc.url);
    //     //   const key = localStorage.getItem("key");
    //     //   console.log(`kek`, { key });
    //     //   if (key) {
    //     //     const d = decryptXChaCha20Poly1305(key, password);
    //     //     console.log(`kek key`, d);
    //     //
    //     //     const mnemonic = new Mnemonic(d);
    //     //     const extendedKey = new XPrv(mnemonic.toSeed());
    //     //     const addressPublic = PublicKeyGenerator.fromMasterXPrv(
    //     //       extendedKey,
    //     //       false,
    //     //       BigInt(1),
    //     //     );
    //     //     const addressPublic1 = PublicKeyGenerator.fromXPub(
    //     //       addressPublic.toString(),
    //     //     );
    //     //     if (addressPublic) {
    //     //       console.log(
    //     //         `kek publick key`,
    //     //         addressPublic.receiveAddressAsStrings("mainnet", 0, 1),
    //     //         addressPublic1.receiveAddressAsStrings("mainnet", 0, 1),
    //     //       );
    //     //       setAddress(
    //     //         addressPublic.receiveAddressAsStrings("mainnet", 0, 1)[0],
    //     //       );
    //     //     }
    //     //   }
    //     //
    //     //   const monitorProcessor = new UtxoProcessor({
    //     //     rpc: rpc,
    //     //     networkId: "mainnet",
    //     //   });
    //     //   monitorProcessor.start().then(() => {
    //     //     setProcessor(monitorProcessor); // Сохраняем processor
    //     //
    //     //     const monitorContext = new UtxoContext({
    //     //       processor: monitorProcessor,
    //     //     });
    //     //     setContext(monitorContext); // Сохраняем context
    //     //     console.log(`kek monitorContext`, monitorContext);
    //     //     monitorProcessor.addEventListener((event) => {
    //     //       setEvents((prevEvents) => prevEvents + 1); // Увеличиваем количество событий
    //     //       console.log("event:", event);
    //     //     });
    //     //   });
    //     // });
    //   }
    // });
    return () => {
      if (processor) {
        processor.stop();
      }
    };
  }, []);

  const handleTrackAddress = async (address: string) => {
    if (context) {
      try {
        console.log("Tracking address:", address);
        await context.trackAddresses([address]);
        console.log(`kek`, context);
      } catch (e) {
        console.log("Error:", e);
      }
    }
  };

  const handleRestart = async () => {
    if (context && processor) {
      console.log("Restarting...");
      console.log("Stopping processor...");
      await context.clear();
      await processor.stop();
      console.log("Starting processor...");
      await processor.start();
      console.log("Processor started...");
    }
  };

  const sendCoins = (): void => {
    alert(`Sending ${amount} KAS to ${sendTo}`);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-2xl font-bold mb-4">Kaspa Monitor</h2>
        <div>
          <p id="actions">| Received {events} event(s)</p>
          <br />
          <input
            id="address"
            type="text"
            placeholder="Enter network address..."
            className="border p-2 rounded-md"
            value={address}
            readOnly
          />
          <br />
          <button
            id="submit"
            className="text-blue-500"
            onClick={(e) => {
              e.preventDefault();
              handleTrackAddress(address).then(() => {
                if (context) {
                  const b = Number(context.balance?.mature ?? 0) / 1e8;
                  console.log(`kek balalnce`, b);
                  setBalance(b);
                }
              });
            }}
          >
            Click to monitor address
          </button>
          <br />
          <button id="restart" className="text-red-500" onClick={handleRestart}>
            Restart
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold">Wallet Address:</h2>
      <p className="bg-gray-800 p-2 rounded">{"wallet?.address"}</p>
      <h2 className="text-xl font-bold">Balance: {balance.toFixed(2)} KAS</h2>
      <Input
        type="text"
        placeholder="Recipient Address"
        value={sendTo}
        onChange={(e) => setSendTo(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={sendCoins}>Send</Button>
      <Button
        onClick={() => {
          reset();
          navigate("/");
        }}
        className="bg-red-600"
      >
        Logout
      </Button>
    </div>
  );
};
