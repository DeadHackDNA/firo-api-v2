import { prismaMongo } from "@/lib/prisma";
import { getGeminiResponse } from "@/utils/ask-gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, sender, content, intent, entities, sentiment } = body;

    if (!userId || !sender || !content) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: userId, sender, content" },
        { status: 400 }
      );
    }

    // Buscar conversación existente o crear una
    let conversation = await prismaMongo.conversation.findFirst({
      where: { userId },
      orderBy: { startTime: "desc" },
    });

    if (!conversation) {
      conversation = await prismaMongo.conversation.create({
        data: { userId, context: { createdBy: "auto" } },
      });
    }

    // Guardar mensaje del usuario
    const userMessage = await prismaMongo.message.create({
      data: {
        conversationId: conversation.id,
        sender,
        content,
        intent,
        entities,
        sentiment,
      },
    });

    // Si el mensaje proviene del usuario, obtener respuesta del LLM
    let botMessage = null;
    if (sender === "USER") {
      const aiText = await getGeminiResponse(content);

      botMessage = await prismaMongo.message.create({
        data: {
          conversationId: conversation.id,
          sender: "BOT",
          content: aiText,
        },
      });

      // Guardar en AnswerLLM
      await prismaMongo.answerLLM.create({
        data: {
          userId,
          question: content,
          answer: aiText,
        },
      });
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      userMessage,
      botMessage,
    });
  } catch (error) {
    console.error("❌ Error al procesar mensaje:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
