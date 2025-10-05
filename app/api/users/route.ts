import { prismaMongo } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { name, email } = reqBody;

    // Validaciones básicas
    if (!name) {
      return Response.json({ error: "El nombre es obligatorio." }, { status: 400 });
    }

    if (!email) {
      return Response.json({ error: "El email es obligatorio." }, { status: 400 });
    }

    const existingUser = await prismaMongo.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return Response.json(existingUser, { status: 200 });
    }

    // Crear el nuevo usuario
    const user = await prismaMongo.user.create({
      data: {
        name,
        email,
      },
    });

    return Response.json(user, { status: 201 });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
