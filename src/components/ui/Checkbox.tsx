'use client';

import { Check } from './Icons';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

// Visually mirrors HeroUI's Checkbox (bordered control, scale-in fill +
// checkmark on select) without pulling in @heroui/react — a native
// `sr-only` input drives the visuals via `peer-checked:` on its sibling
// layers, so it stays keyboard/focus accessible for free.
const Checkbox = ({ id, label, checked, onChange }: CheckboxProps) => (
  <label htmlFor={id} className="flex items-center gap-2 text-accent/80 text-[13px] cursor-pointer select-none">
    <span className="relative inline-flex size-[18px] shrink-0">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={
          'pointer-events-none absolute inset-0 rounded-[5px] border-2 border-[#ffffff40] transition-colors duration-200 ease-out ' +
          'peer-checked:border-ns-green peer-focus-visible:ring-2 peer-focus-visible:ring-ns-green/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#00251e]'
        }
      />
      <span
        className={
          'pointer-events-none absolute inset-[2px] origin-center scale-50 rounded-[3px] bg-ns-green opacity-0 transition-[transform,opacity] duration-200 ease-out ' +
          'peer-checked:scale-100 peer-checked:opacity-100'
        }
      />
      <Check
        className={
          'pointer-events-none absolute inset-0 m-auto size-2.5 origin-center scale-50 stroke-[#001914] opacity-0 transition-[transform,opacity] duration-200 ease-out ' +
          'peer-checked:scale-100 peer-checked:opacity-100'
        }
      />
    </span>
    {label}
  </label>
);

export default Checkbox;
