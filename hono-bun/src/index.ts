import { Hono } from "hono";
import { getAgent } from "./agent.js";

const agent = await getAgent();
const identifier = await agent.didManagerGetByAlias({
  alias: "key-1",
  provider: "did:key",
});

const app = new Hono();

app.get("/example", (c) => c.text("Hello, world!"));

app.get("/issue", async (c) => {
  const credential = await agent.createVerifiableCredential({
    proofFormat: "jwt",
    credential: {
      issuer: identifier.did,
      type: ["VerifiableCredential", "ProgramCompletionCertificate"],
      credentialSubject: {
        accomplishmentType: "Developer Certificate",
        learnerName: "John Doe",
        achievement: "Certified Solidity Developer 2",
        courseProvider: "https://blockchain-lab.um.si/",
        id: "did:web:example.johndoe.com",
      },
      credentialSchema: {
        id: "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json",
        type: "JsonSchemaValidator2018",
      },
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json",
      ],
    },
  });

  //   console.log(credential);

  return c.json(credential);
});

export default {
  port: 3000,
  fetch: app.fetch,
};
