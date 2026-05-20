import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            const error = parsed.error.issues[0].message;
            return NextResponse.json({ error }, { status: 400 });
        }

        const { email, password, name } = parsed.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        // Don't return the hashed password
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { user: userWithoutPassword, message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        const message = error instanceof Error ? error.message : "";

        if (/DATABASE_URL|PrismaClientInitializationError|Can't reach database server|Invalid datasource URL/i.test(message)) {
            return NextResponse.json(
                { message: "Database is not configured correctly. Check DATABASE_URL and your Prisma connection." },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
