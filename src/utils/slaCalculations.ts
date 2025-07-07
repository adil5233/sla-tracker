import { WORKING_HOURS, WORKING_DAYS, PRIORITY_SLA } from "../constants";
import { Priority, SLAStatus } from "../types";

export function calculateSLA(createdAt: Date, priority: Priority): Date {
  const slaHours = PRIORITY_SLA[priority];
  const createdDate = new Date(createdAt);
  let remainingHours = slaHours;
  let currentDate = new Date(createdDate);

  // If created outside working hours, move to next working time
  if (!isWorkingTime(currentDate)) {
    currentDate = nextWorkingTime(currentDate);
  }

  while (remainingHours > 0) {
    if (!isWorkingDay(currentDate)) {
      currentDate = nextWorkingDay(currentDate);
      continue;
    }

    const startOfWorkDay = new Date(currentDate);
    startOfWorkDay.setHours(
      Math.floor(WORKING_HOURS.start),
      (WORKING_HOURS.start % 1) * 60,
      0,
      0
    );

    const endOfWorkDay = new Date(currentDate);
    endOfWorkDay.setHours(
      Math.floor(WORKING_HOURS.end),
      (WORKING_HOURS.end % 1) * 60,
      0,
      0
    );

    // Current time within working hours
    const currentTime = new Date(currentDate);

    // Calculate time left in current working day
    const timeLeftToday = Math.min(
      (endOfWorkDay.getTime() - currentTime.getTime()) / (1000 * 60 * 60),
      remainingHours
    );

    if (timeLeftToday > 0) {
      remainingHours -= timeLeftToday;
      currentDate = new Date(
        currentDate.getTime() + timeLeftToday * 60 * 60 * 1000
      );
    } else {
      currentDate = nextWorkingDay(currentDate);
    }
  }

  return currentDate;
}

export function isWorkingTime(date: Date): boolean {
  const hours = date.getHours() + date.getMinutes() / 60;
  return hours >= WORKING_HOURS.start && hours < WORKING_HOURS.end;
}

export function isWorkingDay(date: Date): boolean {
  return WORKING_DAYS.includes(date.getDay());
}

export function nextWorkingTime(date: Date): Date {
  const newDate = new Date(date);
  if (!isWorkingDay(newDate)) {
    return nextWorkingDay(newDate);
  }

  const startOfWorkDay = new Date(newDate);
  startOfWorkDay.setHours(
    Math.floor(WORKING_HOURS.start),
    (WORKING_HOURS.start % 1) * 60,
    0,
    0
  );

  if (newDate < startOfWorkDay) {
    return startOfWorkDay;
  } else {
    return nextWorkingDay(newDate);
  }
}

export function nextWorkingDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  newDate.setHours(
    Math.floor(WORKING_HOURS.start),
    (WORKING_HOURS.start % 1) * 60,
    0,
    0
  );

  while (!isWorkingDay(newDate)) {
    newDate.setDate(newDate.getDate() + 1);
  }

  return newDate;
}

export function formatDateTime(dateTime: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return dateTime.toLocaleString("en-US", options);
}

export function formatTimeRemaining(now: Date, slaTime: Date): string {
  const diff = slaTime.getTime() - now.getTime();
  if (diff <= 0) return "Breached";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m remaining`;
}

export function getSLAStatus(
  now: Date,
  slaTime: Date,
  priority: Priority
): SLAStatus {
  if (now >= slaTime) return "Breached";

  const diffHours = (slaTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffHours < 2) return "Critical";
  if (diffHours < PRIORITY_SLA[priority] * 0.25) return "Warning";
  return "OK";
}

// Returns the number of working hours between two dates, respecting WORKING_HOURS and WORKING_DAYS
export function getWorkingHoursBetween(start: Date, end: Date): number {
  let total = 0;
  let current = new Date(start);
  const endDate = new Date(end);
  while (current < endDate) {
    if (isWorkingDay(current)) {
      const workStart = new Date(current);
      workStart.setHours(
        Math.floor(WORKING_HOURS.start),
        (WORKING_HOURS.start % 1) * 60,
        0,
        0
      );
      const workEnd = new Date(current);
      workEnd.setHours(
        Math.floor(WORKING_HOURS.end),
        (WORKING_HOURS.end % 1) * 60,
        0,
        0
      );
      // If end is before workStart, skip to next day
      if (endDate <= workStart) {
        current = nextWorkingDay(current);
        continue;
      }
      // Calculate overlap for this day
      const dayStart = current > workStart ? current : workStart;
      const dayEnd = endDate < workEnd ? endDate : workEnd;
      if (dayStart < dayEnd) {
        total += (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60 * 60);
      }
    }
    // Move to next day
    current = nextWorkingDay(current);
  }
  return total;
}
