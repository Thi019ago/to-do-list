import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (email: string, password: string) => {
    const existingUser = await User.findOne({email});
    if (existingUser) throw new Error("Email já cadastrado");
    if (!email.includes("@")) throw new Error("E-mail inválido");

    if (password.length < 6) throw new Error("Senha muito curta");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    return generateToken(user._id.toString());
};

export const login = async (email: string, password: string) => {
    const user = await User.findOne({email});
    if (!user) throw new Error(" Usuário não encontrado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Senha incorreta");

    return generateToken(user._id.toString());
};

function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "2h" });
};