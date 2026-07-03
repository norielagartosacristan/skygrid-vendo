import prisma from "../config/prisma";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(
    email: string,
    password: string
) {

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d",
        }
    );

    return {
        token,
        user,
    };
}