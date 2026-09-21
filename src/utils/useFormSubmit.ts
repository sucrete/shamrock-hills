'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const TEMPLATE_IDS: Record<string, string | undefined> = {
  'tournament-inquiry': process.env.NEXT_PUBLIC_EMAILJS_TOURNAMENT_TEMPLATE_ID,
  contact: process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID,
};

export function useFormSubmit(formType: string) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async (fields: Record<string, string>) => {
    const templateId = TEMPLATE_IDS[formType];
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!templateId || !serviceId || !publicKey) {
      setStatus('error');
      setErrorMessage('Something went wrong sending that. Please try again, or call us directly.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    try {
      await emailjs.send(serviceId, templateId, fields, { publicKey });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong sending that. Please try again, or call us directly.');
    }
  };

  return { status, errorMessage, submit };
}
