import type { PrismaClient } from '@prisma/client';
import { Priority } from '@prisma/client';

function isWorkingDay(date: Date, holidayTimes: Set<number>) {
  const day = date.getDay();
  return day !== 0 && day !== 6 && !holidayTimes.has(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export async function calculateDueAt(prisma: PrismaClient, entryDate: Date, documentType: string, priority: Priority) {
  const rule = await prisma.slaRule.findFirst({ where: { active: true, priority, documentType }, orderBy: { workingDays: 'asc' } })
    || await prisma.slaRule.findFirst({ where: { active: true, priority, documentType: null }, orderBy: { workingDays: 'asc' } });
  if (!rule) return null;
  const holidays = await prisma.holiday.findMany({ where: { date: { gte: entryDate } }, select: { date: true } });
  const holidayTimes = new Set(holidays.map(({ date }) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
  const due = new Date(entryDate);
  let remaining = rule.workingDays;
  while (remaining > 0) {
    due.setDate(due.getDate() + 1);
    if (isWorkingDay(due, holidayTimes)) remaining -= 1;
  }
  return due;
}
