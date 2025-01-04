import Groq from "groq-sdk";
import { NextResponse } from "next/server";

//Initialize the Groq client
const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { llm, message, prompt } = body;
    //console.log("message", message);
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
      model: llm,
    });

    //console.log(chatCompletion.choices[0].message.content);
    const llmresponse = chatCompletion.choices[0].message.content;

    return NextResponse.json({ message: llmresponse });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
