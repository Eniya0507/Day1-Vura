import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = resetPasswordSchema.safeParse(body);

        if (!parsed.success) {
            const error = parsed.error.issues[0].message;
            return NextResponse.json({ error }, { status: 400 });
        }

        const { token, password } = parsed.data;

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(), // Extracted token must still be valid
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired password reset token" },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
