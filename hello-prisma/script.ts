//import { llm } from "./node_modules/.prisma/client/index.d";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runMain = async () => {
  try {
    const llm = await prisma.llm.create({
      data: {
        llm: "llm",
        input: "your_input_value", // Add the required field
        output: "your_output_value", // Add the required field
        expectedOutput: "your_expected_output_value", // Add the required field

        // userId: your_user_id_value, // Include userId if required by your schema
      },
    });
    console.log(llm);
    return "LLM created successfully!";
  } catch (error) {
    console.error("Error creating LLM:", error);
    return "Error creating LLM.";
  } finally {
    await prisma.$disconnect();
  }
};
