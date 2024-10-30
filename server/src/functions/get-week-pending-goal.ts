import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, sql, lte, count, gte, eq } from 'drizzle-orm'

export async function getWeekPendingGoals() {
  const lastDayOfWeek = dayjs().endOf('week').toDate()
  const firstDayOfWeek = dayjs().startOf('week').toDate()

  const goalCreatedUpToWeek = db.$with('goal_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )
  // Seleciona todas as metas onde as datas de crição sejam menor ou igual a o ultimo dia desse semana

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCountn'), //conta quantas vezes ela foi concluida
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId) //Agrupa pelo Id da meta
  )

  // Usa as demais tabelas de cima
  const pendingGoals = await db
    .with(goalCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalCreatedUpToWeek.id,
      title: goalCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goalCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalCreatedUpToWeek.id)
    )

  return { pendingGoals }
}
