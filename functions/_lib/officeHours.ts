// Office hours: who gets to book a call straight away.
//
// The /apply/talk form asks a few qualifying questions. If the answers clear
// the bar below, the founder is shown the booking link right away and their
// card goes to Intro call. Otherwise they're told the team will follow up and
// the card goes to New for someone to look at.
//
// To change the bar or the booking page, change these two lines.

/** Minimum revenue so far this year, in dollars. */
export const MIN_REVENUE_YTD = 150_000;

/** Where qualified founders pick a time (Ahmad's alfred_ page). */
export const BOOKING_URL = "https://get-alfred.ai/book/meeting-0w3n";

const dollars = (v: unknown) => Number(String(v ?? "").replace(/[$,\s]/g, "")) || 0;

export type OfficeHoursResult = { qualified: boolean; revenueYTD: number; reason: string };

export function checkOfficeHours(a: Record<string, string | string[]>): OfficeHoursResult {
  const revenueYTD = dollars(a.revenueYTD);
  const qualified = revenueYTD >= MIN_REVENUE_YTD;
  const bar = "$" + MIN_REVENUE_YTD.toLocaleString("en-US");
  // No figures here: this goes on the Asana card, and numbers stay in Drive.
  return {
    qualified,
    revenueYTD,
    reason: qualified
      ? `Office hours: qualified (revenue this year is at or above ${bar}). Shown the booking link.`
      : `Office hours: below the bar (revenue this year is under ${bar}). Told the team will follow up.`,
  };
}
