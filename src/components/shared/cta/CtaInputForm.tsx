'use client';

import RevealAnimation from '@/components/animation/RevealAnimation';
import { cn } from '@/utils/cn';

interface CtaInputFormProps {
  btnClass?: string;
  ctaBtnText?: string;
  inputFieldClass?: string;
}

const CtaInputForm = ({ btnClass, ctaBtnText = 'Get Started', inputFieldClass }: CtaInputFormProps) => {
  return (
    <RevealAnimation delay={0.4}>
      <form
        action="#"
        method="post"
        className="flex flex-col items-center justify-start gap-3 md:flex-row"
        aria-label="cta-form">
        <input
          type="email"
          name="email"
          id="userEmail"
          placeholder="Enter your email"
          required
          className={cn(
            'placeholder:text-black/50 text-black focus-visible:outline-stroke-7 focus:border-primary-600 h-12 w-[85%] rounded-full border-accent px-[18px] py-3 placeholder: focus:outline-none focus-visible:outline-1 md:w-[430px] lg:w-[340px]',
            inputFieldClass,
          )}
          aria-label="cta-input"
        />
        <button
          type="submit"
          className={cn(
            'btn btn-md btn-primary bg-black border-none hover:btn-secondary h-12 w-[85%] md:w-auto',
            btnClass,
          )}
          aria-label="cta-button">
          <span>{ctaBtnText}</span> 
        </button>
      </form>
    </RevealAnimation>
  );
};
CtaInputForm.displayName = 'CtaInputForm';

export default CtaInputForm;
