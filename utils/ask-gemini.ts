"use server";

import { generatePrompt } from "@/utils/prompt-gemini";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const getGeminiResponse = async (userMessage: string) => {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  try {
    const fullPrompt = generatePrompt(userMessage);

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed: ${response.status}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const responseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    // JSON
    // const match = responseText.match(/{[\s\S]*}/);
    // if (!match) {
    //   return {
    //     success: false,
    //     message: "No valid JSON found in the response.",
    //   };
    // }

    // const jsonResponse = JSON.parse(match[0]) as GeminiCVAnalysisResponse;

    return responseText;
  } catch (err) {
    console.error("❌ Gemini error:", err);
    return "Ocurrió un error al generar la respuesta del asistente.";
  }
};
