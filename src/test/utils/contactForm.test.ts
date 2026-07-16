import { describe, expect, it } from 'vitest';
import {
  normalizeContactForm,
  validateContactField,
  validateContactForm,
} from '../../utils/contactForm';

describe('contact form validation', () => {
  it('normalizes user-entered values before validation and submission', () => {
    expect(
      normalizeContactForm({
        name: '  Alex  ',
        email: '  alex@example.com ',
        topic: ' feedback ',
        message: '  A useful message.\n ',
      }),
    ).toEqual({
      name: 'Alex',
      email: 'alex@example.com',
      topic: 'feedback',
      message: 'A useful message.',
    });
  });

  it('accepts a valid form and an optional empty name', () => {
    expect(
      validateContactForm({
        name: '',
        email: 'alex+improv@example.co.uk',
        topic: 'idea',
        message: 'Please add this useful feature.',
      }),
    ).toEqual({});
  });

  it('rejects unknown topics and enforces field length limits', () => {
    expect(validateContactField('topic', 'billing')).toBe('topicInvalid');
    expect(validateContactField('name', 'a'.repeat(121))).toBe('nameTooLong');
    expect(validateContactField('message', 'a'.repeat(3001))).toBe('messageTooLong');
    expect(validateContactField('email', `${'a'.repeat(250)}@example.com`)).toBe('emailInvalid');
  });
});
