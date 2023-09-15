import { FastifyPluginAsync } from "fastify";
import { getAgent } from "../../modules/agent.js";

const issue: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const agent = await getAgent();
  const identifier = await agent.didManagerGetByAlias({
    alias: "key-1",
    provider: "did:key",
  });

  fastify.get("/", async function (request, reply) {
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

    reply.send(credential);
  });
};

export default issue;
