
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Frequency, Priority } from "../types";

export const generateMaintenancePlan = async (buildingDescription: string) => {
  // Use process.env.API_KEY directly when initializing the GoogleGenAI client instance
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere um cronograma de manutenção predial preventiva detalhado para o seguinte perfil de edifício: ${buildingDescription}. 
    Retorne uma lista de tarefas contendo título, descrição, categoria, frequência, prioridade e uma explicação do porquê essa manutenção é necessária.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { 
              type: Type.STRING, 
              enum: Object.values(Category) 
            },
            frequency: { 
              type: Type.STRING, 
              enum: Object.values(Frequency) 
            },
            priority: { 
              type: Type.STRING, 
              enum: Object.values(Priority) 
            },
            justification: { type: Type.STRING }
          },
          required: ["title", "description", "category", "frequency", "priority"]
        }
      }
    }
  });

  try {
    // Accessing response.text as a property, not a method.
    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};
