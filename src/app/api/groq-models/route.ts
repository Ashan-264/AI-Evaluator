import Groq from "groq-sdk";
import { NextResponse } from "next/server";

//Initialize the Groq client
const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

interface Model {
  id: string;
  owned_by: string;
}

export async function GET() {
  try {
    const response = await client.models.list();
    const models: Model[] = response.data.map(
      (model: { id: string; owned_by: string }) => ({
        id: model.id,
        owned_by: model.owned_by,
      })
    );
    console.log(models);
    return NextResponse.json({ models: models });
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}
