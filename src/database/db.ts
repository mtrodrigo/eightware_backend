import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI não definido nas variáveis de ambiente.");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      dbName: "eightware",
      serverSelectionTimeoutMS: 5000
    });
    console.log("Mongo DB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MOngo DB: ", error);
  }
};


