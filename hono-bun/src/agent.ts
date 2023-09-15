import {
  KeyDIDProvider,
  getDidKeyResolver,
} from "@blockchain-lab-um/did-provider-key";
import {
  createAgent,
  ICredentialPlugin,
  IDIDManager,
  IKeyManager,
  IResolver,
} from "@veramo/core";
import { CredentialPlugin } from "@veramo/credential-w3c";
import { DIDManager, MemoryDIDStore } from "@veramo/did-manager";
import { EthrDIDProvider } from "@veramo/did-provider-ethr";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from "@veramo/key-manager";
import { KeyManagementSystem } from "@veramo/kms-local";
import { Resolver } from "did-resolver";
import { getResolver as getEthrResolver } from "ethr-did-resolver";

export const getAgent = async () => {
  const INFURA_PROJECT_ID = "";
  const networks = [
    {
      name: "mainnet",
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    },
    {
      name: "goerli",
      rpcUrl: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
    },
  ];

  const agent = createAgent<
    IDIDManager & IKeyManager & IResolver & ICredentialPlugin
  >({
    plugins: [
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      // Change and only support from the config file
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: "did:ethr",
        providers: {
          "did:ethr": new EthrDIDProvider({
            defaultKms: "local",
            networks,
          }),
          "did:key": new KeyDIDProvider({
            defaultKms: "local",
          }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...getEthrResolver({ networks }),
          ...getDidKeyResolver(),
        }),
      }),
      new CredentialPlugin(),
    ],
  });

  await agent.didManagerCreate({
    kms: "local",
    alias: "key-1",
    provider: "did:key",
    options: {},
  });

  return agent;
};
