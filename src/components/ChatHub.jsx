import { SITE } from '@/config/site';

export default function ChatHub() {
  return (
    <a className="wafloat" href={`https://wa.me/${SITE.whatsapp}`} aria-label="Chat on WhatsApp" target="_blank" rel="noopener">
      💬
    </a>
  );
}
