'use client';
import { useState } from 'react';
import { FORMS, SITE } from '@/config/site';

export default function WebForm({ subject, fromName, thankYouUrl, children, onSuccess, extraFields }) {
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [replyEmail, setReplyEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;

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
