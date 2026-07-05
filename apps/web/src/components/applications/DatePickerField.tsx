"use client";

import { useMemo, useState } from "react";

const inputClassName =
  "w-full cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600";

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function toValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(month: Date): Date[] {
  const firstDay = startOfMonth(month);
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - mondayBasedOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function sameDay(a: Date | null, b: Date): boolean {
  return !!a && a.toDateString() === b.toDateString();
}

function formatDisplay(date: Date | null): string {
  if (!date) {
    return "Select date";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
}: Readonly<{
  id: string;
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
}>) {
  const selectedDate = useMemo(() => parseValue(value), [value]);
  const [open, setOpen] = useState(false);
  const [monthCursor, setMonthCursor] = useState<Date>(
    selectedDate ?? startOfMonth(new Date()),
  );

  const monthGrid = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);

  const visibleMonth = monthCursor.getMonth();

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-foreground/60">
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={inputClassName}
      >
        {formatDisplay(selectedDate)}
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+0.5rem)] z-20 w-full min-w-[17rem] rounded-xl border border-border bg-background p-3 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setMonthCursor(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
              className="rounded-md px-2 py-1 text-sm text-foreground/70 hover:bg-surface"
            >
              ←
            </button>

            <p className="text-sm font-semibold text-foreground">
              {monthCursor.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </p>

            <button
              type="button"
              onClick={() =>
                setMonthCursor(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
              className="rounded-md px-2 py-1 text-sm text-foreground/70 hover:bg-surface"
            >
              →
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekdayLabels.map((labelText) => (
              <span
                key={labelText}
                className="text-center text-[11px] font-semibold text-foreground/50"
              >
                {labelText}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((date) => {
              const isCurrentMonth = date.getMonth() === visibleMonth;
              const isSelected = sameDay(selectedDate, date);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => {
                    onChange(toValue(date));
                    setOpen(false);
                  }}
                  className={`h-8 rounded-md text-xs transition-colors ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : isCurrentMonth
                        ? "text-foreground hover:bg-surface"
                        : "text-foreground/35 hover:bg-surface"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 text-xs text-foreground/70 hover:bg-surface"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-primary-600 px-2 py-1 text-xs font-medium text-white hover:bg-primary-700"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
