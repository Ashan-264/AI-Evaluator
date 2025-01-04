"use client";
import test from "node:test";
import React, { useState } from "react";

const HomePage: React.FC = () => {
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedCriteria, setSelectedCriteria] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [testPrompt, setTestPrompt] = useState<string>("");
  const [testCases, setTestCases] = useState<
    Array<{ input: string; expectedOutput: string; systemPrompt: string }>
  >([]);
  const [testResults, setTestResults] = useState<Result[]>([]);
  const [models, setModels] = useState<Array<{ model: string; owner: string }>>(
    [{ model: "none", owner: "none" }]
  );
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "5px",
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid white",
    color: "white",
    cursor: "pointer",
  };
  const [results, setResults] = useState([
    {
      key: 1,
      name: "eval",
      llm: "GPT-3",
      input: "Luke...",
      output: "Star Wars",
      expected: "Star Wars: A New Hope",
      exactMatch: "0.00%",
      duration: "0.7s",
    },
    {
      key: 2,
      name: "eval",
      llm: "GPT-3",
      input: "An orphan...",
      output: "Harry Potter",
      expected: "Harry Potter: Philosopher's Stone",
      exactMatch: "0.00%",
      duration: "1.3s",
    },
    {
      key: 3,
      name: "eval",
      llm: "Claude",
      input: "The life story...",
      output: "Forrest Gump",
      expected: "Forrest Gump",
      exactMatch: "100.00%",
      duration: "2.1s",
    },
    {
      key: 4,
      name: "eval",
      llm: "Claude",
      input: "A young lion...",
      output: "The Lion King",
      expected: "The Lion King",
      exactMatch: "100.00%",
      duration: "0.8s",
    },
    {
      key: 5,
      name: "eval",
      llm: "Bard",
      input: "An office...",
      output: "Fight Club",
      expected: "Fight Club",
      exactMatch: "100.00%",
      duration: "2.1s",
    },
    {
      key: 6,
      name: "eval",
      llm: "Bard",
      input: "A young FBI...",
      output: "The Silence...",
      expected: "The Silence of the Lambs",
      exactMatch: "100.00%",
      duration: "0.9s",
    },
  ]);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  interface Result {
    key?: number;
    name?: string;
    llm?: string;
    input?: string;
    output?: string;
    expected?: string;
    cosineSimilar?: string;
    exactMatch?: string;
    duration?: number;
  }
  const handlePromptSubmit = async () => {
    setLoading(true);
    console.log(testCases);
    const startTime = performance.now();
    try {
      await Promise.all(
        testCases.map(async (testCase) => {
          const response = await fetch("/api/llms-groq", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              llm: "llama-3.1-70b-versatile",
              message: testCase.input,
              prompt: testCase.systemPrompt,
            }),
          });
          const endTime = performance.now();
          const duration = endTime - startTime;
          if (!response.ok) {
            throw new Error(
              `Failed to send message to ${selectedLLM}, status: ${response.status}`
            );
          }
          const data = await response.json();

          console.log("duration ", duration);
          const output = data.message;
          // if (data.message) {
          //   setResponse(data.message);
          // }

          const responseMatch = await fetch("/api/cosine-similarity", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              output: data.message,
              expectedOutput: testCase.expectedOutput,
            }),
          });

          if (!responseMatch.ok) {
            throw new Error(
              `Failed to send message to ${selectedLLM}, status: ${responseMatch.status}`
            );
          }
          const matchData = await responseMatch.json();

          const match = matchData.match;
          const formattedMatch = (parseFloat(match) * 100).toFixed(3) + "%";
          console.log("cosine data: ", matchData.match, formattedMatch);

          const llmResponseMatch = await fetch("/api/llm-judge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              output: data.message,
              expectedOutput: testCase.expectedOutput,
            }),
          });

          if (!llmResponseMatch.ok) {
            throw new Error(
              `Failed to send message to ${selectedLLM}, status: ${llmResponseMatch.status}`
            );
          }
          const llmMatchData = await llmResponseMatch.json();

          const llmMatch = llmMatchData.llmJudgeMatch;
          console.log("lmm match data: ", llmMatchData);

          const newResult: Result = {
            name: "eval",
            llm: "llama-3.1-70b-versatile",
            input: testCase.input,
            output: data.message,
            expected: testCase.expectedOutput,
            cosineSimilar: formattedMatch,
            exactMatch: llmMatch,
            duration: duration,
          };
          handleRunMain(newResult);
        })
      );
    } catch (error) {
      // if (!data.success) {
      //   throw new Error(data.error || "Failed to receive response from llm");
      // }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSinglePromptSubmit = async () => {
    setLoading(true);
    console.log(testCases);
    const startTime = performance.now();
    try {
      const response = await fetch("/api/llms-groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          llm: "llama-3.1-70b-versatile",
          message: prompt,
          prompt: "Answer Question",
        }),
      });
      const endTime = performance.now();
      const duration = endTime - startTime;
      if (!response.ok) {
        throw new Error(
          `Failed to send message to ${selectedLLM}, status: ${response.status}`
        );
      }
      const data = await response.json();

      console.log("duration ", duration);
      if (data.message) {
        setResponse(data.message);
      }
    } catch (error) {
      // if (!data.success) {
      //   throw new Error(data.error || "Failed to receive response from llm");
      // }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/prisma", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("all records", data.records);
      setTestResults([]);
      data.records.forEach((record) => {
        const newResult: Result = {
          key: record.id,
          name: "eval",
          llm: record.llm,
          input: record.input,
          output: record.output,
          expected: record.expectedOutput,
          cosineSimilar: record.cosineSimilarity,
          exactMatch: record.exactMatch,
          duration: record.duration,
        };

        setTestResults((prevResults) => [...prevResults, newResult]);
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetGroqModels = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/groq-models", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      const modalData = data.models.map((model) => ({
        model: model.id,
        owner: model.owned_by,
      }));

      console.log("all records", modalData);
      setModels([]);

      setModels(modalData);
      console.log("data", models);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testType: testPrompt }),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to test cases for ${testPrompt}, status: ${response.status}`
        );
      }
      const data = await response.json();
      console.log("data", data);

      const extractedTestCases = data.testCases.testCases.map((testCase) => ({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        systemPrompt: testCase.systemPrompt,
      }));

      extractedTestCases.map((extractedTestCase) => {
        console.log("output expected", extractedTestCase.expectedOutput);
      });

      // if (data.testCases) {
      //   setResponse(JSON.stringify(extractedTestCases));
      // }

      if (Array.isArray(extractedTestCases)) {
        setTestCases(extractedTestCases); // Update state with the fetched test cases
      } else {
        console.error("testCases is not an array:", data.testCases);
      }
    } catch (error) {
      console.error("Error:", error);
      if (!data.success) {
        throw new Error(data.error || "Failed to receive response from llm");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/prisma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deleteAll",
        }),
      });

      setTestResults([]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunMain = async (record: Result) => {
    setLoading(true);
    try {
      console.log("record", record);
      const response = await fetch("/api/prisma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          llmName: `${record.llm}`,
          input: `${record.input}`,
          output: `${record.output}`,
          expectedOutput: `${record.expected}`,
          cosineSimilar: `${record.cosineSimilar}`,
          duration: `${record.duration}`,
          match: `${record.exactMatch}`,
          action: "create",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to enter into table, status: ${response.status}`
        );
      }
      const data = await response.json();
      // if (!data.success) {
      //   throw new Error(data.error || "Failed to receive response from llm");
      // }
      console.log(data);
      handleGetData();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(135deg, #2c3e50, #4ca1af)", // Dark gradient
        color: "#f1f1f1", // Softer white
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000, // Ensure it appears above other elements
            color: "#f1f1f1", // Softer white for better readability
            fontSize: "20px", // Keeps font size consistent
            padding: "15px 30px", // Adds some spacing around the text
            background: "rgba(44, 62, 80, 0.8)", // Semi-transparent dark background
            borderRadius: "8px", // Smooth rounded corners
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
            textAlign: "center", // Ensures the text is centered
          }}
        >
          Running process...
        </div>
      )}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "48px", // Prominent title size
          fontWeight: "bold", // Strong emphasis on the text
          color: "rgba(255, 255, 255, 0.95)", // Softer, near-white color for elegance
          textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)", // Enhanced shadow for depth
          letterSpacing: "2px", // Elegant spacing
          fontFamily: "'Arial', sans-serif", // Clean and professional font
          fontStyle: "italic", // Adds sophistication with italics
          textDecoration: "none", // Removed underline for a cleaner look
          padding: "15px 30px", // Comfortable padding
          background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Gradient for a modern look
          borderRadius: "12px", // Smooth rounded corners
          display: "inline-block", // Background adjusts to text
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)", // Subtle shadow for emphasis
        }}
      >
        InsightAI
      </h2>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleGetGroqModels}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid white",
            color: "white",
            cursor: "pointer",
            visibility: "hidden",
          }}
        >
          Get Groq Models
        </button>

        <button
          onClick={handleGetData}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid white",
            color: "white",
            cursor: "pointer",
            visibility: "hidden",
          }}
        >
          Populate Table
        </button>

        <button
          onClick={handleDeleteAll}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid white",
            color: "white",
            cursor: "pointer",
          }}
        >
          Delete records from database
        </button>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <select
          onChange={(e) => {
            const selectedValue = e.target.value;
            setSelectedProvider(selectedValue); // Update the selected provider state

            // Call handleGetGroqModels if "Groq" is selected
            if (selectedValue === "Groq") {
              handleGetGroqModels();
            }
          }}
          value={selectedProvider || ""}
          style={{
            width: "30%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid white",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
        >
          <option value="" disabled style={{ color: "black" }}>
            Select LLM Provider
          </option>
          <option value="Groq" style={{ color: "black" }}>
            Groq
          </option>
        </select>

        <div style={{ marginTop: "20px" }}>
          <label style={{ color: "white" }}>Owner:</label>
          <input
            type="text"
            value={selectedOwner || ""}
            readOnly // Make it read-only if you don't want to allow editing
            style={{
              width: "50%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid white",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          />
        </div>

        <select
          onChange={(e) => {
            const selectedValue = e.target.value;
            setSelectedLLM(selectedValue);

            const selectedModel = models.find(
              (model) => model.model === selectedValue
            );
            if (selectedModel) {
              setSelectedOwner(selectedModel.owner); // Update the owner state
            } else {
              setSelectedOwner(""); // Reset if no model is found
            }
          }}
          value={selectedLLM || ""}
          style={{
            width: "30%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid white",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
        >
          <option value="" disabled style={{ color: "black" }}>
            Select LLM
          </option>
          {models.map((model) => (
            <option
              key={model.model}
              value={model.model}
              style={{ color: "black" }}
            >
              {model.model} {/* Assuming each model has a 'name' property */}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Enter your prompt"
          style={{
            width: "70%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid white",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleSinglePromptSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid white",
            color: "white",
            cursor: "pointer",
          }}
        >
          Submit prompt
        </button>

        <button
          onClick={handlePromptSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid white",
            color: "white",
            cursor: "pointer",
          }}
        >
          Run tests
        </button>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Enter your test prompt"
          style={{
            width: "70%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid white",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerateTests}
          disabled={!testPrompt.trim()}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid white",
            color: "white",
            cursor: "pointer",
          }}
        >
          Generate Test cases
        </button>
      </div>

      <div
        style={{
          padding: "20px",
          background: "rgba(0, 0, 0, 0.8)",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "20px", color: "#add8e6" }}>Results</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "white",
          }}
        >
          <thead style={{ background: "rgba(0, 0, 0, 0.9)" }}>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Test Type
              </th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>LLM</th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Input
              </th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Output
              </th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Expected
              </th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Cosine Similarity Match
              </th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Exact Similarity Match
              </th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, index) => (
              <tr key={index} style={{ borderTop: "1px solid #333" }}>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.llm}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.input}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.output}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.expected}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.cosineSimilar}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.exactMatch}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {result.duration}ms
                </td>
              </tr>
            ))}
            {/* {testCases.map((testCase, index) => (
              <tr key={index} style={{ borderTop: "1px solid #333" }}>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {testCase.input}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {testCase.expectedOutput}
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "white" }}>Generated Test Cases</h3>
        <table
          style={{ width: "100%", borderCollapse: "collapse", color: "white" }}
        >
          <thead style={{ background: "rgba(0, 0, 0, 0.9)" }}>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Input
              </th>
              <th style={{ padding: "10px", border: "1px solid #333" }}>
                Expected Output
              </th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase, index) => (
              <tr key={index} style={{ borderTop: "1px solid #333" }}>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {testCase.input}
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  {testCase.expectedOutput}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "5px",
          color: "white",
        }}
      >
        <h3 style={{ color: "#add8e6" }}>LLM Response</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default HomePage;
