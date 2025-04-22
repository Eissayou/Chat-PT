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
    const videoFile = formData.get('video');

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
          text: `Analyze the uploaded workout video and return your answer using **Markdown formatting**. Follow this structure:
        
        ### 1. **Exercise Detected**
        State the primary exercise performed.
        
        ### 2. **Overall Form Evaluation**
        Briefly describe overall form quality in 2–3 concise sentences.
        
        ### 3. **Issues Identified**
        Use bullet points. If no major issues exist, say: _No significant issues found._
        
        ### 4. **Corrections & Tips**
        For each issue, provide a matching fix using this format:
        - **Issue:** [short description]  
          **Tip:** [clear and helpful suggestion]
        
        Use clear section headers and structured formatting. Avoid filler commentary or acknowledging this prompt. Output should be fully Markdown-compatible. Finally, if video doesnt seem like a workout, simply respond: "This doesnt seem like a workout, please upload a video of you working out so I can check your form."`
        }
        ,
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
