const PLATFORM_PHONE = '5491100000000';

export function buildWhatsAppLink(phone, message) {
  const cleanPhone = String(phone).replace(/[^\d]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function platformWhatsAppLink(message) {
  return buildWhatsAppLink(PLATFORM_PHONE, message);
}
