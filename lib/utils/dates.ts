import { differenceInCalendarDays, addDays, format, getDay } from "date-fns";

export function dayIndex(startDate: Date, current: Date): number {
  return differenceInCalendarDays(current, startDate) + 1;
}

export function endDate(startDate: Date): Date {
  return addDays(startDate, 89);
}

export function formatDayLabel(date: Date): string {
  return format(date, "EEE d MMM").toUpperCase();
}

export function dayOfWeek(date: Date): number {
  return getDay(date); // 0=Sun..6=Sat
}

export function isScheduledToday(scheduleDays: number[], date: Date): boolean {
  return scheduleDays.includes(dayOfWeek(date));
}
