import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado ao MongoDB");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));
