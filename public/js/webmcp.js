(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;
  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'browse_products',
        description: 'Browse products by category',
        inputSchema: { type: 'object', properties: { category: { type: 'string', description: 'Product category to browse' } } },
        execute: async ({ category }) => {
          const url = category ? 'https://www.umbraelectric.com/shop/' + category + '/' : 'https://www.umbraelectric.com/shop/';
          window.location.href = url;
          return { url };
        },
      },
      {
        name: 'order_via_whatsapp',
        description: 'Initiate a WhatsApp order. Minimum order $500.',
        inputSchema: { type: 'object', properties: { message: { type: 'string', description: 'Pre-filled order message' } } },
        execute: async ({ message }) => {
          const url = message ? 'https://wa.me/14482348667?text=' + encodeURIComponent(message) : 'https://wa.me/14482348667';
          window.open(url, '_blank');
          return { url };
        },
      },
      {
        name: 'get_wholesale_info',
        description: 'Get wholesale pricing tiers and ordering info',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => { window.location.href = 'https://www.umbraelectric.com/wholesale/'; return { url: 'https://www.umbraelectric.com/wholesale/' }; },
      },
      {
        name: 'contact',
        description: 'Contact for product questions or support',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => { window.location.href = 'https://www.umbraelectric.com/contact/'; return { url: 'https://www.umbraelectric.com/contact/' }; },
      },
    ],
  });
})();
