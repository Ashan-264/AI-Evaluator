//import { llm } from "./node_modules/.prisma/client/index.d";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const llm = await prisma.llm.create({ data: { name: "llama" } });
  console.log(llm);
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
