'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { Calendar } from '../../ui/Icons';
import Button from '../../ui/button/Button';
import Checkbox from '../../ui/Checkbox';

// Mirrors the group checkboxes on shamrockhills.com's current newsletter form
// (id="mensAssoc"/"seniors"/"couples"/"ladies") — same labels, so submissions
// land as the same fields in Campaign Monitor.
const GROUPS = [
  { id: 'golf-association', label: 'Golf Association' },
  { id: 'seniors-golf', label: 'Seniors Golf' },
  { id: 'couples-league', label: 'Couples League' },
  { id: 'ladies-league', label: 'Ladies League' },
] as const;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Stage = 'contact' | 'groups' | 'success';

const fieldClass =
  'w-full bg-transparent border-0 border-b border-accent/60 text-accent placeholder:text-accent/40 focus:outline-none focus:border-ns-green/70 transition-colors duration-200 py-2 text-[13px]';

const NewsletterSignup = () => {
  const [stage, setStage] = useState<Stage>('contact');
  const [fading, setFading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [groups, setGroups] = useState<string[]>([]);
  const [birthdayMonth, setBirthdayMonth] = useState<string | null>(null);
  const [monthOpen, setMonthOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const monthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!monthOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) setMonthOpen(false);
    };
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMonthOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [monthOpen]);

  // Swaps stage content only once the current stage has faded out, so the
  // transition reads as "out, then in" rather than a cross-fade.
  const goToStage = (next: Stage) => {
    setFading(true);
    setTimeout(() => {
      setStage(next);
      setFading(false);
    }, 180);
  };

  const handleContinue = (event: FormEvent) => {
    event.preventDefault();
    goToStage('groups');
  };

  const toggleGroup = (id: string) => {
    setGroups((current) => (current.includes(id) ? current.filter((groupId) => groupId !== id) : [...current, id]));
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, birthdayMonth, groups }),
      });
      if (!res.ok) throw new Error('Request failed');
      goToStage('success');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn('newsletter-signup-container w-full mt-8 py-1 px-3 relative z-20')}>
      <div className={cn('transition-opacity duration-200', fading ? 'opacity-0' : 'opacity-100')}>
        {stage === 'contact' && (
          <form onSubmit={handleContinue} className="space-y-4">
            <p className="text-accent/60 text-[13px]">Sign up for our newsletter to get the latest news and promotions</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <input
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First Name"
                aria-label="First Name"
                className={fieldClass}
              />
              <input
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last Name"
                aria-label="Last Name"
                className={fieldClass}
              />
              <div className="col-span-2 flex items-center gap-4">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  aria-label="Email"
                  className={cn(fieldClass, 'flex-1')}
                />
                <Button
                  type="submit"
                  className="border-[#ffffff24] bg-[#ffffff24] text-white hover:bg-[#ffffff33] w-fit shrink-0 text-[13px]">
                  Continue
                </Button>
              </div>
            </div>
          </form>
        )}

        {stage === 'groups' && (
          <div className="space-y-5">
            <div>
              <p className="text-accent/60 text-[13px] mb-4">I&apos;d like to receive emails for these groups:</p>
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {GROUPS.map((group) => (
                  <Checkbox
                    key={group.id}
                    id={group.id}
                    label={group.label}
                    checked={groups.includes(group.id)}
                    onChange={() => toggleGroup(group.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-accent/60 text-[13px] mb-2">Birthday Month (Birthday rounds are on us!)</p>
              <div className="flex items-center gap-8">
                <div className="relative w-full " ref={monthRef}>
                  <button
                    type="button"
                    onClick={() => setMonthOpen((open) => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={monthOpen}
                    className={cn(fieldClass, 'flex items-center justify-between text-left cursor-pointer')}>
                    <span className={birthdayMonth ? 'text-accent' : 'text-accent/40'}>
                      {birthdayMonth ?? 'Select month'}
                    </span>
                    <Calendar className="size-4 fill-accent/60 shrink-0" />
                  </button>

                  {monthOpen && (
                    <div
                      role="listbox"
                      className="absolute z-10 mt-2 w-full bg-[#012922] border border-[#ffffff1a] rounded-xl p-1.5 grid grid-cols-3 gap-1 shadow-xl">
                      {MONTHS.map((month) => (
                        <button
                          key={month}
                          type="button"
                          role="option"
                          aria-selected={birthdayMonth === month}
                          onClick={() => {
                            setBirthdayMonth(month);
                            setMonthOpen(false);
                          }}
                          className={cn(
                            'text-[13px] py-1.5 rounded-md transition-colors duration-150 cursor-pointer',
                            birthdayMonth === month
                              ? 'bg-ns-green text-[#001914]'
                              : 'text-accent/70 hover:bg-white/5',
                          )}>
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  <button
                    type="button"
                    onClick={() => goToStage('contact')}
                    className="text-accent/50 hover:text-accent/80 text-[13px] transition-colors duration-200 cursor-pointer">
                    Back
                  </button>
                  <Button
                    type="button"
                    onClick={handleFinish}
                    disabled={submitting}
                    className="border-[#ffffff24] bg-[#ffffff24] text-white hover:bg-[#ffffff33] w-fit shrink-0 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'Submitting…' : 'Finish'}
                  </Button>
                </div>
              </div>
              {error && <p className="text-red-400 text-[13px] mt-2">{error}</p>}
            </div>
          </div>
        )}

        {stage === 'success' && (
          <div className="py-8 text-center">
            <p className="text-ns-green text-[13px]">Subscribed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
