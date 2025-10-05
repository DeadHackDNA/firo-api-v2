import { prismaMongo } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ userId: string }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { userId } = await params;

    const conversations = await prismaMongo.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    if (!conversations.length) {
      return NextResponse.json({ message: "No hay conversaciones para este usuario." });
    }

    const allMessages = conversations.flatMap((conv) => conv.messages);

    return NextResponse.json({
      userId,
      totalConversations: conversations.length,
      totalMessages: allMessages.length,
      conversations,
    });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
