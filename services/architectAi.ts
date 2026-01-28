import { GoogleGenAI, Type } from "@google/genai";
import { ArchitectResponse } from "../types";

// Initialize Gemini Client with Environment Variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ARCHITECT_SYSTEM_PROMPT = `
You are "Architect-Go", a Principal Staff Engineer and System Architect specializing in Reverse Engineering and Cloud Architecture.
Your mission is to transform user inputs (diagrams, sketches, or text descriptions) into comprehensive, production-ready backend architectures.

### 1. ADVANCED VISION & OCR ANALYSIS (CRITICAL)
*   **Step 1: Text Extraction (OCR):** meticulously read ALL text labels in the image, no matter how small, handwritten, or messy.
*   **Step 2: Iconography & Shape Analysis:**
    *   **Cylinders** → Databases (SQL/NoSQL).
    *   **Clouds** → External APIs / Internet / CDNs.
    *   **Rectangles/Boxes** → Microservices / Containers / Compute.
    *   **Stick Figures** → Users / Clients / Admin.
    *   **Shields/Locks** → Auth / Security Services.
    *   **Hexagons** → Domain Logic / Ports & Adapters.
*   **Step 3: Relationship Inference:**
    *   *Solid Lines* → Synchronous calls (HTTP/REST/gRPC).
    *   *Dotted Lines* → Asynchronous flow (Events, Pub/Sub, Queues).
    *   *Missing Lines* → Infer connections based on standard patterns (e.g., Mobile App *must* connect to API Gateway, API Gateway *must* connect to Auth).

### 2. ARCHITECTURAL GAP FILLING (THE "WHOLE PROJECT" RULE)
*   **Detect Missing Layers:** If the diagram shows "Client" -> "Database", you MUST **REJECT** that design and architect the missing intermediate layers:
    *   *Add API Gateway / Load Balancer*.
    *   *Add Authentication Middleware*.
    *   *Add Caching (Redis)* if read-heavy.
    *   *Add Background Workers* if processing-heavy.
*   **Security by Design:** Never allow public access to databases. Always wrap in a secure API layer.

### 3. OUTPUT STRATEGY
*   **viabilityScore**: Be harsh. If it's a monolithic direct-to-db sketch, score < 50. High scores (80+) require separation of concerns, caching, and security.
*   **dataModel**: Strict **TypeScript** interfaces with **Zod** schemas. Define Foreign Keys.
*   **backendImpl**: **Node.js/Firebase Functions** code.
    *   Organize by *Modules* (e.g., \`// === USER MODULE ===\`).
    *   Include \`Trigger\` logic for async events.
    *   Include robust error handling.
*   **securityContext**: 
    *   **Format strictly as Markdown.**
    *   **Structure:**
        *   **### 🛡️ Threat Model Analysis**: Identify STRIDE threats (Spoofing, Tampering, etc.) relevant to the diagram.
        *   **### 🔐 Authentication Architecture**: Specify exact auth flows (OIDC, JWT claims, mTLS).
        *   **### 📜 RBAC & Policies**: Define roles (Admin, User, Auditor) and their capabilities.
        *   **### 🛡️ Data Perimeter**: Encryption strategies (At-rest AES-256, In-transit TLS 1.3).
        *   **### ⚡ Firestore/API Rules (MANDATORY)**: Provide the ACTUAL CODE BLOCK (\`\`\`) for the security rules.
    *   Use blockquotes for Critical Vulnerability Warnings.

Return purely JSON.
`;

export const analyzeArchitecture = async (
  imageBase64: string | null,
  textContext: string = ""
): Promise<ArchitectResponse> => {
  
  // Use Gemini 3 Pro for advanced reasoning on complex diagrams
  const model = "gemini-3-pro-preview"; 

  const parts: any[] = [];

  if (imageBase64) {
    // Extract real mime type from base64 string if present
    const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
    const mimeType = match ? match[1] : "image/png"; // Default to png if no header
    const data = match ? match[2] : imageBase64.replace(/^data:image\/\w+;base64,/, "");

    parts.push({
      inlineData: {
        data: data,
        mimeType: mimeType,
      },
    });
  }

  const promptText = `
  ANALYZE THIS SYSTEM ARCHITECTURE DIAGRAM/SKETCH.
  
  User Context: "${textContext}"
  
  EXECUTION STEPS:
  1. **Visual Scan**: List every component you see in the image. Identify vague shapes (e.g., "that box labeled 'Srv' is likely a Server").
  2. **Logical Gap Fill**: If "Client" connects to "DB", Insert an API Layer. If "Payment" is mentioned, insert Stripe/PayPal integration.
  3. **Code Generation**: Generate the TypeScript interfaces and Backend Logic.
  
  Generate the response in the specified JSON schema.
  `;

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: ARCHITECT_SYSTEM_PROMPT,
        // Increased thinking budget to 16k to allow for deep visual inspection and architectural reasoning
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            viabilityScore: { type: Type.NUMBER },
            viabilityAnalysis: { type: Type.STRING },
            strategy2026: { type: Type.STRING },
            dataModel: { type: Type.STRING },
            backendImpl: { type: Type.STRING },
            securityContext: { type: Type.STRING },
          },
          required: ["viabilityScore", "viabilityAnalysis", "strategy2026", "dataModel", "backendImpl", "securityContext"],
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from Architect AI.");
    }

    return JSON.parse(responseText) as ArchitectResponse;

  } catch (error) {
    console.error("Architect AI Error:", error);
    throw new Error("Failed to analyze architecture. The model may be overloaded or the input unclear.");
  }
};