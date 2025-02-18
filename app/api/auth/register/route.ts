import { hashPassword } from "../../utils/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenGenerate";
import { NextRequest, NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas";
import prisma from "@/lib/prisma";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body safely
    let body: RegisterRequestBody;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid JSON format or empty request body" },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    // Validate input data
    const validation = RegisterSchema.safeParse({ name, email, password });
    if (!validation.success) {
      console.error("Validation error:", validation.error.errors);
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    let hashedPassword: string;
    try {
      hashedPassword = await hashPassword(password);
    } catch (error) {
      console.error("Password hashing error:", error);
      return NextResponse.json(
        { error: "Failed to hash password" },
        { status: 500 }
      );
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id.toString());
    const refreshToken = generateRefreshToken(user.id.toString());

    // Prepare user response (omit password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Send success response with tokens
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userResponse,
        accessToken,
        refreshToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
