/**
 * Generates a WhatsApp click-to-chat URL.
 * @param message - Pre-filled message text (URL-encoded automatically)
 * @param phone - Phone number in international format without '+' (e.g., '919876543210')
 */
export function generateWhatsAppLink(message: string, phone?: string): string {
  const encodedMessage = encodeURIComponent(message);
  if (phone) {
    const sanitizedPhone = phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;
  }
  return `https://wa.me/?text=${encodedMessage}`;
}

export function buildTaskNudgeMessage(taskTitle: string, dueDate?: string): string {
  const duePart = dueDate ? ` (due: ${dueDate})` : "";
  return `🙏 Namaste! Gentle reminder about the wedding task: "${taskTitle}"${duePart}. Please update the status when done. — via ShaadiOS`;
}

export function buildVendorFollowUpMessage(vendorName: string, category: string): string {
  return `Namaste ${vendorName}! Following up regarding ${category} services for our wedding. Could you please share an update? — via ShaadiOS`;
}
