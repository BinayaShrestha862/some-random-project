import bcrypt from "bcryptjs";

// function for hash password
const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password,10);
}

// function for compare hashpassword
const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
}

export {
    hashPassword,
    comparePassword
}