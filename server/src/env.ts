import z from "zod";

// Garente que a variavel DATABASE_URL do drizzle existe
// se erro não roda
const envSchema = z.object({
    DATABASE_URL: z.string().url(),
});

//Verifica se process.env é uma string e url
export const env = envSchema.parse(process.env)