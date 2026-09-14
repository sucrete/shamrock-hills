import { cn } from '@/utils/cn';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  insideSpan?: boolean;
}

const Button = ({ children, className, insideSpan = true, type = 'button', ...props }: ButtonProps) => {
  return (
    <button type={type} className={cn('btn btn-md', className)} {...props}>
      {insideSpan ? <span>{children}</span> : children}
    </button>
  );
};

Button.displayName = 'Button';
export default Button;
