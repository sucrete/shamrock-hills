'use client';

import { useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import moment, { Moment } from 'moment';
import { cn } from '@/utils/cn';
import { Calendar, SmallArrow } from './Icons';
import { inputClass } from '../shared/forms/FormField';

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  placeholder?: string;
  className?: string;
}

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DATE_FORMAT = 'YYYY-MM-DD';

// Monday-first 6x7 grid covering the full visible month, matching the site's
// existing calendar convention (Calendar.tsx uses firstDay={1}).
const buildMonthGrid = (viewMonth: Moment) => {
  const cursor = viewMonth.clone().startOf('month').startOf('isoWeek');
  const weeks: Moment[][] = [];
  for (let week = 0; week < 6; week++) {
    const days: Moment[] = [];
    for (let day = 0; day < 7; day++) {
      days.push(cursor.clone());
      cursor.add(1, 'day');
    }
    weeks.push(days);
  }
  return weeks;
};

const DatePicker = ({ id, value, onChange, minDate, placeholder = 'Select a date', className }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = value ? moment(value, DATE_FORMAT) : null;
  const [viewMonth, setViewMonth] = useState(() => (selected ?? moment()).clone().startOf('month'));
  const min = minDate ? moment(minDate, DATE_FORMAT) : null;
  const today = moment().startOf('day');

  const weeks = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const handleSelect = (day: Moment) => {
    if (min && day.isBefore(min, 'day')) return;
    onChange(day.format(DATE_FORMAT));
    setOpen(false);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setViewMonth((selected ?? moment()).clone().startOf('month'));
      }}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          className={cn(
            inputClass,
            'flex items-center justify-between gap-2 text-left',
            selected ? 'text-black' : 'text-black/40',
            className,
          )}>
          {selected ? selected.format('MMMM D, YYYY') : placeholder}
          <Calendar className="size-4 shrink-0 fill-black/40" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-[60] w-[300px] rounded-[14px] border border-black/5 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,.04),0_16px_40px_rgba(0,0,0,.12)] data-[state=open]:animate-[tooltip-fade-in_150ms_ease-out] data-[state=closed]:animate-[tooltip-fade-out_100ms_ease-in]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth((prev) => prev.clone().subtract(1, 'month'))}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full text-black/50 transition-colors hover:bg-bushwood-600/10 hover:text-bushwood-700">
              <SmallArrow className="size-3.5 rotate-180 fill-current" />
            </button>
            <p className="text-[14px] font-medium text-black">{viewMonth.format('MMMM YYYY')}</p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth((prev) => prev.clone().add(1, 'month'))}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full text-black/50 transition-colors hover:bg-bushwood-600/10 hover:text-bushwood-700">
              <SmallArrow className="size-3.5 fill-current" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="text-[11px] font-medium text-black/40">
                {label}
              </span>
            ))}
            {weeks.map((week) =>
              week.map((day) => {
                const inMonth = day.isSame(viewMonth, 'month');
                const isSelected = !!selected && day.isSame(selected, 'day');
                const isToday = day.isSame(today, 'day');
                const disabled = !!min && day.isBefore(min, 'day');

                return (
                  <button
                    key={day.format(DATE_FORMAT)}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(day)}
                    className={cn(
                      'mx-auto flex size-8 cursor-pointer items-center justify-center rounded-full text-[13px] transition-colors',
                      inMonth ? 'text-black' : 'text-black/25',
                      !disabled && !isSelected && 'hover:bg-bushwood-600/10',
                      isToday && !isSelected && 'font-semibold text-bushwood-700',
                      isSelected && 'bg-bushwood-600 text-white hover:bg-bushwood-600',
                      disabled && 'cursor-not-allowed opacity-30 hover:bg-transparent',
                    )}>
                    {day.date()}
                  </button>
                );
              }),
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default DatePicker;
