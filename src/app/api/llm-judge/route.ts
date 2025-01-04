import Groq from "groq-sdk";
import { NextResponse } from "next/server";

//Initialize the Groq client
const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { output, expectedOutput } = body;
    //console.log("output: ", output);
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are the worlds greatest llm output judge and comparer. Only return a percent out of 100%  (cannot be greater than 100% or less than 0%) about how closely matching or related the below output and expected output are.",
        },
        {
          role: "user",
          content: `output of llm being tested: ${output}, expected output: ${expectedOutput}`,
        },
      ],
      model: "llama-3.1-70b-versatile",
    });

    //console.log(chatCompletion.choices[0].message.content);
    const llmresponse = chatCompletion.choices[0].message.content;
    console.log("llm", llmresponse);
    return NextResponse.json({ llmJudgeMatch: llmresponse });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
