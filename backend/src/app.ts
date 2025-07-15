import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Carrega variáveis do .env

const app = express(); // Inicia o servidor
app.use(cors()); // Libera CORS para o frontend acessar
app.use(express.json()); // Permite receber JSON no body das requisições

app.get("/", (req, res) => {
  res.send("API To-do List funcionando!");
});

export default app;
