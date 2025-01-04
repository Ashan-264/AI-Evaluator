import * as natural from "natural";
import similarity from "compute-cosine-similarity";
import { NextResponse } from "next/server";

// Function to calculate cosine similarity between two strings
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { output, expectedOutput } = body;
    // Create a TF-IDF vectorizer
    const tfidf = new natural.TfIdf();

    // Add the strings to the vectorizer
    tfidf.addDocument(output);
    tfidf.addDocument(expectedOutput);

    // Get the TF-IDF vectors for each string
    const vector1 = tfidf.listTerms(0).map((term) => term.tf); // Vector for str1
    const vector2 = tfidf.listTerms(1).map((term) => term.tf); // Vector for str2

    // Pad shorter vector with zeros (to make them the same length)
    const maxLength = Math.max(vector1.length, vector2.length);
    while (vector1.length < maxLength) vector1.push(0);
    while (vector2.length < maxLength) vector2.push(0);

    // Calculate cosine similarity
    const similar = similarity(vector1, vector2);
    // console.log("expected output: ", expectedOutput);
    // console.log("output: ", output);
    console.log("cosine similarity: ", similar);
    const strSimilar = JSON.stringify(similar);
    return NextResponse.json({ match: strSimilar });
  } catch (error) {
    console.error("Error calculating cosine similarity: ", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
