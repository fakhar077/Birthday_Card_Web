
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT_TEMPLATE = `I want to create a personalized birthday card. I will provide a photo, and I would like that image to be converted into vector art and artistically edited. Using this artwork, I want a beautifully designed birthday poster/card that includes stylish graphics, birthday elements (like balloons, confetti, cake, etc.), and a heartfelt birthday message that says: "Happy Birthday [Name]". The overall design should feel festive, elegant, and visually appealing.`;

export const generateBirthdayCard = async (
  base64ImageData: string,
  mimeType: string,
  name: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const prompt = PROMPT_TEMPLATE.replace('[Name]', name);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the image part in the response
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData
    );

    if (imagePart && imagePart.inlineData) {
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    } else {
      throw new Error("API did not return an image. It might have been blocked due to safety policies.");
    }
  } catch (error) {
    console.error("Error generating birthday card:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate card: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating the card."));
  }
};
