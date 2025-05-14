import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

interface CreateLLMBody {
  llmName: string;
  input: string;
  output: string;
  expectedOutput: string;
  duration?: string;
  cosineSimilar?: string;
  match?: string;
  action?: string;
}

//Initialize the Groq client
const prisma = new PrismaClient({
  log: ["error"], // Logs errors to the console
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("creating records in table", body);

    // Check if body is null or not an object
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    if (body.action === "create") {
      const llmRecord = await create(body);
      return NextResponse.json({ record: llmRecord });
    }

    if (body.action === "deleteAll") {
      await deleteAll();
      return NextResponse.json({ message: "deleted" });
    }
    return NextResponse.json({ message: "invalid action" });
  } catch (error) {
    console.error("Error:", error);

    // Ensure the error response is always an object
    const errorMessage = {
      code: "ERR_INVALID_ARG_TYPE",
      message:
        error instanceof Error ? error.message : "An unknown error occurred", // Add a message for clarity
    };
    return NextResponse.json(errorMessage, { status: 500 }); // Return the error message as JSON
  }
}

async function create(body: CreateLLMBody) {
  try {
    //console.log("creating records in table", body);
    const {
      llmName,
      input,
      output,
      expectedOutput,
      cosineSimilar,
      match,
      duration,
    } = body;
    //console.log("cosine similarity", cosineSimilarity);
    const llmRecord = await prisma.llm.create({
      data: {
        llm: `${llmName}`,
        input: `${input}`, // Add the required field
        output: `${output}`, // Add the required field
        expectedOutput: `${expectedOutput}`, // Add the required field
        cosineSimilarity: cosineSimilar,
        exactMatch: match,
        duration: duration ? Math.round(parseFloat(duration)) : 0,
        successfull: true,
        // userId: your_user_id_value, // Include userId if required by your schema
      },
    });
    //console.log("data added", llmRecord);
    //console.log("llm api route works", llmRecord);
    return llmRecord;
  } catch (error) {
    console.error("Error creating LLM record:", error);
    throw new Error("Failed to create LLM record"); // Rethrow with a custom message
  }
}

async function deleteAll() {
  const deleteUsers = await prisma.llm.deleteMany({});
  console.log("llm records deleted", deleteUsers);
}

export async function GET() {
  try {
    const allRecords = await prisma.llm.findMany();
    //console.log("records", allRecords);
    return NextResponse.json({ records: allRecords });
  } catch (error) {
    console.error("Error :", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
