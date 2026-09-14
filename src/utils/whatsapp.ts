import { CartItem, CheckoutFormData } from "../types";

export const ARY_SERVICES_PHONE_DISPLAY = "0333 6554090";
export const ARY_SERVICES_PHONE_INTL = "923336554090";
export const KANAF_PHONE_DISPLAY = "0543-692020";
export const KANAF_PHONE_TEL = "+92543692020";

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function generateWhatsAppOrderUrl(
  items: CartItem[],
  checkout: CheckoutFormData,
  deliveryFee: number = 0,
  orderNumber?: string
): string {
  const subtotal = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const total = subtotal + deliveryFee;

  const itemLines = items
    .map(
      (ci, idx) =>
        `${idx + 1}. *${ci.quantity} × ${ci.item.name}* — ${formatPrice(ci.item.price * ci.quantity)}` +
        (ci.specialNotes ? `\n   _(Note: ${ci.specialNotes})_` : "")
    )
    .join("\n");

  const message = [
    `*NEW ORDER — KANAF CAFE & BAKERY*`,
    orderNumber ? `*Order Ref:* #${orderNumber}` : `*Date:* ${new Date().toLocaleDateString("en-PK")}`,
    `--------------------------------`,
    `*Addressed to:* ARY SERVICES`,
    `--------------------------------`,
    `*CUSTOMER DETAILS:*`,
    `• *Name:* ${checkout.customerName}`,
    `• *Phone:* ${checkout.phone}`,
    `• *Delivery Address:* ${checkout.deliveryAddress}`,
    checkout.landmark ? `• *Landmark / Area:* ${checkout.landmark}` : null,
    `--------------------------------`,
    `*ORDER SUMMARY:*`,
    itemLines,
    `--------------------------------`,
    `*Subtotal:* ${formatPrice(subtotal)}`,
    deliveryFee > 0 ? `*Delivery Fee:* ${formatPrice(deliveryFee)}` : null,
    `*TOTAL AMOUNT:* ${formatPrice(total)}`,
    `--------------------------------`,
    checkout.notes ? `*Order Notes / Instructions:*\n${checkout.notes}\n--------------------------------` : null,
    `_Thank you for ordering from Kanaf Cafe & Bakery!_`
  ]
    .filter(Boolean)
    .join("\n");

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${ARY_SERVICES_PHONE_INTL}?text=${encoded}`;
}
