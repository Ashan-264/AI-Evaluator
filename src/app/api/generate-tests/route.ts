import Groq from "groq-sdk";
import { NextResponse } from "next/server";

//Initialize the Groq client
const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testType } = body;
    //console.log(testType);
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            'You are an LLM test case creator. Create rigorous test cases in a single JSON array format. Each test case must be an object with the structure: {"input": string, "expectedOutput": string, "systemPrompt": string}. Ensure the "systemPrompt" specifies the length (give a range) of the expected output from the testing LLM. Respond with only a single valid JSON array and nothing else.',
        },
        {
          role: "user",
          content: `create 10 test cases of ${testType} `,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const llmresponse = chatCompletion.choices[0].message.content;

    if (!llmresponse) {
      console.error("Error: llmresponse is null or undefined");
      return NextResponse.json(
        { success: false, error: "Invalid response from LLM" },
        { status: 500 }
      );
    }
    const cleanedResponse = llmresponse.replace(/```/g, "").trim();
    let testCases;
    try {
      testCases = JSON.parse(cleanedResponse); // Parse the JSON string into an object
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { success: false, error: "Failed to parse JSON response" },
        { status: 500 }
      );
    }

    //console.log(testCases);

    return NextResponse.json({ testCases: testCases });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create test cases" },
      { status: 500 }
    );
  }
}
