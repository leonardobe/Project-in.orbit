import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema' //Colaca todas as exportações do schema.ts em uma variavel schema
import { env } from '../env';

export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, {schema, logger: true})