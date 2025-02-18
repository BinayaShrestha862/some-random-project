import { comparePassword } from "../../utils/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenGenerate";
import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/schemas";
import prisma from "@/lib/prisma";
import { serialize } from "cookie";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body safely
    let body: LoginRequestBody;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid JSON format or empty request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Validate input data
    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      console.error("Validation error:", validation.error.errors);
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true, 
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user.password is null
    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id.toString());
    const refreshToken = generateRefreshToken(user.id.toString());

    // Set cookies
    const accessTokenCookie = serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    const refreshTokenCookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Prepare user response (omit password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Send success response with cookies
    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: userResponse,
        accessToken,
        refreshToken,
      }),
      {
        status: 200,
        headers: [
          ["Content-Type", "application/json"],
          ["Set-Cookie", accessTokenCookie],
          ["Set-Cookie", refreshTokenCookie],
        ],
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}