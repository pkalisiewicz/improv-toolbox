const FORMSPREE_ENDPOINT = 'https://formspree.io/f';

export const CONTACT_TOPICS = ['feedback', 'bug', 'idea', 'other'] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];
export type ContactField = 'name' | 'email' | 'topic' | 'message';
export type ContactValidationCode =
  | 'nameTooLong'
  | 'emailRequired'
  | 'emailInvalid'
  | 'topicInvalid'
  | 'messageRequired'
  | 'messageTooShort'
  | 'messageTooLong';

export interface ContactFormValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<ContactField, ContactValidationCode>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

/** Returns the public Formspree submission endpoint, or null when not configured. */
export function getContactFormEndpoint(formId = import.meta.env.VITE_FORMSPREE_FORM_ID): string | null {
  const normalizedId = formId?.trim();
  return normalizedId && /^[a-zA-Z0-9]+$/.test(normalizedId)
    ? `${FORMSPREE_ENDPOINT}/${normalizedId}`
    : null;
}

export function normalizeContactForm(values: ContactFormValues): ContactFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    topic: values.topic.trim(),
    message: values.message.trim(),
  };
}

export function validateContactField(
  field: ContactField,
  rawValue: string,
): ContactValidationCode | undefined {
  const value = rawValue.trim();

  switch (field) {
    case 'name':
      return value.length > 120 ? 'nameTooLong' : undefined;
    case 'email':
      if (!value) return 'emailRequired';
      return value.length > 254 || !EMAIL_PATTERN.test(value) ? 'emailInvalid' : undefined;
    case 'topic':
      return CONTACT_TOPICS.includes(value as ContactTopic) ? undefined : 'topicInvalid';
    case 'message':
      if (!value) return 'messageRequired';
      if (value.length < 10) return 'messageTooShort';
      return value.length > 3000 ? 'messageTooLong' : undefined;
  }
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  for (const field of ['name', 'email', 'topic', 'message'] as const) {
    const error = validateContactField(field, values[field]);
    if (error) errors[field] = error;
  }

  return errors;
}
