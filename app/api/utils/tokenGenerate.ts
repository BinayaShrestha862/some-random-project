import jwt from "jsonwebtoken";

// Ensure environment variables are defined
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;
const EXPIRESIN_ACCESS_TOKEN = process.env.EXPIRESIN_ACCESS_TOKEN!;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN!;
const EXPIRESIN_REFRESH_TOKEN = process.env.EXPIRESIN_REFRESH_TOKEN!;


interface TokenPayload {
    id: string;
}

// Generate access token
const generateAccessToken = (id: string): string => {
    try {
        const payload: TokenPayload = { id };
        return jwt.sign(payload, JWT_ACCESS_TOKEN, {
            expiresIn: EXPIRESIN_ACCESS_TOKEN,
        });
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Failed to generate access token.");
    }
};

// Generate refresh token
const generateRefreshToken = (id: string): string => {
    try {
        const payload: TokenPayload = { id };
        return jwt.sign(payload, JWT_REFRESH_TOKEN, {
            expiresIn: EXPIRESIN_REFRESH_TOKEN,
        });
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Failed to generate refresh token.");
    }
};

// Verify access token
const verifyAccessToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_TOKEN) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error("Error verifying access token:", error);
        throw new Error("Invalid or expired access token.");
    }
};

// Verify refresh token
const verifyRefreshToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_TOKEN) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        throw new Error("Invalid or expired refresh token.");
    }
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
