//Tabela do banco de dados
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const goals = pgTable('goals', {
  id: text('id').primaryKey().$defaultFn(() => createId()), //Preenche o id pela função createId
  title: text('title').notNull(), //Titulo da atividade
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(), //Numero de vezes para patricar a meta
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(), // Dta da crição da meta
  // withTimezone -> guarda o fuso horário do pais acessado
})

export const goalCompletions = pgTable('goal_completions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  goalId: text('goal_id')
    .references(() => goals.id)
    .notNull(), //Id da meta completada
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(), // Dta da crição da meta
  // withTimezone -> guarda o fuso horário do pais acessado
})
