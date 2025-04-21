// src/app/api/summarize-video/route.js
import { NextResponse } from 'next/server';
import {
    GoogleGenAI,
    createUserContent,
    createPartFromUri,
  } from "@google/genai";

// Ensure you have GOOGLE_API_KEY in your .env.local
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

export async function POST(request) {
  try {
    // 1. Get the form data from the request
    const formData = await request.formData();
    const videoFile = formData.get('video'); // 'video' should match the name attribute in your form input

    // 2. Basic Validation
    if (!videoFile) {
      return NextResponse.json({ error: 'No video file uploaded.' }, { status: 400 });
    }

    // Check if it's actually a file (basic check)
    if (!(videoFile instanceof File)) {
       return NextResponse.json({ error: 'Uploaded item is not a file.' }, { status: 400 });
    }

    // Optional: Add more robust MIME type validation if needed
    const allowedMimeTypes = ["video/mp4"]; // Add other types Gemini supports if needed
    if (!allowedMimeTypes.includes(videoFile.type)) {
         return NextResponse.json({ error: `Invalid file type. Only ${allowedMimeTypes.join(', ')} allowed.` }, { status: 400 });
    }

    // 3. Convert video file to Base64
    // Read the file content as an ArrayBuffer
    const fileBuffer = await videoFile.arrayBuffer();
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(fileBuffer);
    // Convert Buffer to Base64 string
    const base64Video = buffer.toString('base64');

    // 4. Prepare the request for the Gemini API
    //const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use 1.5 flash as it's generally good for multimodal

    // 5. Call the Gemini API
    const contents = [
        {
          inlineData: {
            mimeType: videoFile.type,
            data: base64Video,
          },
        },
        {
            text: `Analyze the workout video and respond using the format below:
          1. Exercise Detected: [State the name of the exercise]
          2. Form Evaluation: [Briefly describe how the form looks overall — what was done well or poorly]
          3. Issues Identified: [List specific form issues, if any — use bullet points]
          4. Corrections & Tips: [For each issue, explain how to fix it — clear, helpful suggestions]
          
          Keep the response clear and structured, with 2–4 sentences per section if needed. Avoid filler commentary.`,
          },
      ];
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
      });

      const summary = response.text ?? null;

      if (!summary) {
        console.error("Gemini returned no text:", response);
        return NextResponse.json({ error: "No summary returned." }, { status: 502 });
      }
      
      return NextResponse.json({ summary });
    }
    catch{
        return NextResponse.json({ summary });
    }
}

// Optional: Add configuration for body size limit if handling larger videos
// This might be necessary as API routes have default limits (e.g., 4MB)
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '100mb', // Adjust as needed, but be mindful of server/platform limits
//     },
//   },
// };
// Note: config export works for Pages Router. For App Router, limits are often configured at the deployment platform level (Vercel, etc.) or potentially via Next.js config - check current Next.js docs.