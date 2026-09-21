'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import RevealAnimation from '../animation/RevealAnimation';
import { FormField, inputClass } from '../shared/forms/FormField';
import DatePicker from '../ui/DatePicker';
import { useFormSubmit } from '@/utils/useFormSubmit';
import { validateRequired, validateEmail, validatePhone, validateNumber } from '@/utils/formValidation';
import golferOnFairway from '@public/images/shamrock-hills/gallery/sh-13.webp';

const CARD_CLASS_FORM = 'main-container mx-auto rounded-[20px] bg-white';
const CARD_CLASS =
  'main-container mx-auto rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.04),0_16px_40px_rgba(0,0,0,.08)]';

interface Fields {
  [key: string]: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  players: string;
  message: string;
}

const INITIAL_FIELDS: Fields = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  players: '',
  message: '',
};

const TournamentInquiryForm = () => {
  const { status, errorMessage, submit } = useFormSubmit('tournament-inquiry');
  const [fields, setFields] = useState<Fields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});

  const handleChange =
    (field: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = () => {
    const nextErrors: Partial<Record<keyof Fields, string>> = {
      name: validateRequired(fields.name, 'Name') ?? undefined,
      email: validateEmail(fields.email) ?? undefined,
      phone: validatePhone(fields.phone) ?? undefined,
      eventDate: validateRequired(fields.eventDate, 'Event date') ?? undefined,
      players: validateNumber(fields.players, 'Approximate # of players') ?? undefined,
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    // Keys here must match the {{variables}} in the EmailJS template
    // (template_0jl4d3v), not this form's own field names.
    await submit({
      submitters_name: fields.name,
      submitters_email: fields.email,
      submitters_phone: fields.phone,
      desired_date: moment(fields.eventDate).format('MMMM Do, YYYY'),
      guest_count: fields.players,
      submitters_message: fields.message,
    });
  };

  if (status === 'success') {
    return (
      <RevealAnimation delay={0.1}>
        <div className={`${CARD_CLASS} p-10 text-center`}>
          <h3 className="text-heading-5 text-bushwood-700 pb-2 md:text-[1.75rem]">Thanks for reaching out!</h3>
          <p className="text-primary/70">We&apos;ve received your tournament inquiry and will be in touch soon.</p>
        </div>
      </RevealAnimation>
    );
  }

  return (
    <RevealAnimation delay={0.1}>
      <form
        id="tournament-inquiry-form"
        onSubmit={handleSubmit}
        noValidate
        className={`${CARD_CLASS_FORM} w-full space-y-5 p-6 md:p-4`}>
        <div className="grid grid-cols-6 gap-16">
          <div className="col-span-6 flex flex-col justify-center p-0 md:col-span-4 md:p-6">
            <div className="pb-8">
              <h3 className="text-heading-5 text-bushwood-700 -ml-0.5 pb-2 md:text-[2.5rem]">
                Plan a Tournament with Us
              </h3>
              <p className="text-primary/70">Fill out the form below and we&apos;ll follow up with details.</p>
            </div>

            {status === 'error' && (
              <p className="mb-5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
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

              <FormField id="phone" label="Phone" required error={errors.phone}>
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

              <FormField id="eventDate" label="Event Date" required error={errors.eventDate}>
                <DatePicker
                  id="eventDate"
                  value={fields.eventDate}
                  onChange={(next) => setFields((prev) => ({ ...prev, eventDate: next }))}
                  minDate={moment().format('YYYY-MM-DD')}
                />
              </FormField>
            </div>

            <FormField
              className="pt-5"
              id="players"
              label="Approximate # of Players"
              required
              error={errors.players}>
              <input
                id="players"
                name="players"
                type="number"
                min="1"
                inputMode="numeric"
                value={fields.players}
                onChange={handleChange('players')}
                className={inputClass}
              />
            </FormField>

            <FormField className="pt-5" id="message" label="Message">
              <textarea
                id="message"
                name="message"
                rows={4}
                value={fields.message}
                onChange={handleChange('message')}
                className={inputClass}
              />
            </FormField>

            <div className="pt-5">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn btn-md btn-header-bushwood hover:btn-white-dark">
                <span>{status === 'submitting' ? 'Sending…' : 'Submit Inquiry'}</span>
              </button>
            </div>
          </div>

          <div className="relative col-span-2 hidden overflow-hidden rounded-xl md:block">
            <Image className="object-cover" src={golferOnFairway} alt="" fill />
          </div>
        </div>
      </form>
    </RevealAnimation>
  );
};

export default TournamentInquiryForm;
