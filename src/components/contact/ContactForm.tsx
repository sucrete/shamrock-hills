'use client';

import { FormEvent, useState } from 'react';
import RevealAnimation from '../animation/RevealAnimation';
import { FormField, inputClass } from '../shared/forms/FormField';
import { useFormSubmit } from '@/utils/useFormSubmit';
import { validateEmail, validatePhone, validateRequired } from '@/utils/formValidation';

const CARD_CLASS = 'max-w-[800px] mx-auto rounded-[20px] bg-white';

const ContactForm = () => {
  const [fields, setFields] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status, errorMessage, submit } = useFormSubmit('contact');

  const handleChange =
    (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = () => {
    const next: Record<string, string> = {};
    const nameErr = validateRequired(fields.name, 'Name');
    if (nameErr) next.name = nameErr;
    const emailErr = validateEmail(fields.email);
    if (emailErr) next.email = emailErr;
    const phoneErr = validatePhone(fields.phone);
    if (phoneErr) next.phone = phoneErr;
    const messageErr = validateRequired(fields.message, 'Message');
    if (messageErr) next.message = messageErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await submit(fields);
  };

  if (status === 'success') {
    return (
      <div className={`${CARD_CLASS} p-10 text-center`}>
        <h3 className="text-heading-5 text-bushwood-700 pb-2 md:text-[1.75rem]">Message sent!</h3>
        <p className="text-primary/70">Thanks for reaching out — we&apos;ll get back to you as soon as we can.</p>
      </div>
    );
  }

  return (
    <RevealAnimation delay={0.1}>
      <form onSubmit={handleSubmit} noValidate className={`${CARD_CLASS} space-y-5 px-6 py-10 md:px-10 md:py-12`}>
        <div className="pb-2 text-center">
          <h3 className="text-heading-5 text-bushwood-700 pb-2 md:text-[1.75rem]">Send Us a Message</h3>
          <p className="text-primary/70 pb-5">After hours? Fill out the form below and we&apos;ll follow up.</p>
        </div>

        {status === 'error' && (
          <p className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="name" label="Name" required error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={fields.name}
              onChange={handleChange('name')}
              className={inputClass}
            />
          </FormField>
          <FormField id="email" label="Email" required error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={fields.email}
              onChange={handleChange('email')}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField id="phone" label="Phone Number" required error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={handleChange('phone')}
            className={inputClass}
          />
        </FormField>

        <FormField id="message" label="Message" required error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={fields.message}
            onChange={handleChange('message')}
            className={inputClass}
          />
        </FormField>

        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn btn-md btn-header-bushwood hover:btn-white-dark">
            <span>{status === 'submitting' ? 'Sending…' : 'Send Message'}</span>
          </button>
        </div>
      </form>
    </RevealAnimation>
  );
};

export default ContactForm;
