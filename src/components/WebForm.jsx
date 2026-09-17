'use client';
import { useState } from 'react';
import { FORMS, SITE } from '@/config/site';

// Enquiries also get logged (fire-and-forget, non-blocking) to the order
// system's admin portal so it lists every contact/wholesale enquiry, not
// just orders -- never allowed to affect this form's existing, working
// Web3Forms send path if the log call fails.
function logEnquiry(form, enquiryType) {
  try {
    const fd = new FormData(form);
    const payload = {};
    for (const [key, value] of fd.entries()) {
      if (['access_key', 'botcheck', 'subject', 'from_name', 'replyto'].includes(key)) continue;
      payload[key] = value;
    }
    fetch('/api/enquiries/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: enquiryType,
        name: fd.get('name') || fd.get('business_name') || 'Unknown',
        email: fd.get('email'),
        phone: fd.get('phone'),
        message: fd.get('message'),
        ...payload,
      }),
    }).catch(() => {});
  } catch {
    // never let enquiry logging affect the real form submission
  }
}

export default function WebForm({ subject, fromName, thankYouUrl, children, onSuccess, extraFields, enquiryType }) {
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [replyEmail, setReplyEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    if (enquiryType) logEnquiry(form, enquiryType);

    const keyPending = !FORMS.web3formsKey || FORMS.web3formsKey.startsWith('YOUR-') || FORMS.web3formsKey === 'WEB3FORMS_KEY_PENDING';
    if (keyPending) {
      onSuccess?.();
      window.location.href = thankYouUrl;
      return;
    }

    const replyInput = form.querySelector('input[name=replyto]');
    if (replyInput) replyInput.value = replyEmail;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        onSuccess?.();
        window.location.href = thankYouUrl;
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="web-form" noValidate onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <input type="hidden" name="access_key" value={FORMS.web3formsKey} />
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="from_name" value={fromName} />
      <input type="hidden" name="botcheck" value="" />
      <input type="hidden" name="replyto" value="" />
      {extraFields}
      {children({ replyEmail, setReplyEmail })}
      <button type="submit" className="btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
      {status === 'error' && (
        <div className="form-error">
          Something went wrong. Please email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or message us on WhatsApp.
        </div>
      )}
    </form>
  );
}
