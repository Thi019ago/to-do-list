import { Request, Response } from "express";
import * as authService from "../services/auth.services";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.register(email, password);
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
