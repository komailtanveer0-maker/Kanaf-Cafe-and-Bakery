import React, { useState } from "react";
import { CartItem, CheckoutFormData, CafeSettings } from "../types";
import { formatPrice, generateWhatsAppOrderUrl, ARY_SERVICES_PHONE_DISPLAY } from "../utils/whatsapp";
import { dataStore } from "../utils/dataStore";
import { X, Send, CheckCircle2, AlertCircle, ShoppingBag, ShieldCheck } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
  settings?: CafeSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  settings,
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: "",
    phone: "",
    deliveryAddress: "",
    landmark: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<"form" | "summary" | "sent">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState<string>("");
  const [createdWhatsAppUrl, setCreatedWhatsAppUrl] = useState<string>("");

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const deliveryFee = 0; // 100% Free Delivery in Chakwal
  const total = subtotal;

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!formData.customerName.trim()) {
      errs.customerName = "Customer Name is required";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (formData.phone.replace(/[^0-9]/g, "").length < 10) {
      errs.phone = "Please enter a valid Pakistani phone number (e.g. 0300 1234567)";
    }
    if (!formData.deliveryAddress.trim()) {
      errs.deliveryAddress = "Delivery Address is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep("summary");
    }
  };

  const handleSendToWhatsApp = async () => {
    setIsSubmitting(true);

    const generatedRef = `KNF-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderRef(generatedRef);

    const targetPhone = settings?.aryWhatsAppIntl || settings?.aryWhatsApp || ARY_SERVICES_PHONE_DISPLAY;

    // Build URL for WhatsApp Dispatch
    const whatsappUrl = generateWhatsAppOrderUrl(items, formData, deliveryFee, generatedRef, targetPhone);
    setCreatedWhatsAppUrl(whatsappUrl);

    // Record order for store records (local + server sync)
    try {
      await dataStore.recordOrder({
        customerName: formData.customerName,
        phone: formData.phone,
        deliveryAddress: formData.deliveryAddress,
        landmark: formData.landmark,
        notes: formData.notes,
        items: items.map((ci) => ({
          id: ci.item.id,
          name: ci.item.name,
          price: ci.item.price,
          quantity: ci.quantity,
          specialNotes: ci.specialNotes || "",
        })),
        total,
      });
    } catch (err) {
      console.warn("Could not record order:", err);
    }

    // Popup WhatsApp window directly
    try {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      window.location.href = whatsappUrl;
    }

    setIsSubmitting(false);
    setStep("sent");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="checkout-modal-container"
        className="relative w-full max-w-xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#5C0D20]/20 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-[#4A0817] text-[#FAF7F2] px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D7E7F2] block">
              Kanaf Cafe & Bakery
            </span>
            <h3 className="font-serif font-bold text-xl text-white">
              {step === "form"
                ? "Complete Your Details"
                : step === "summary"
                ? "Final Order Review"
                : "Order Dispatched"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {step === "form" ? (
            <form onSubmit={handleProceedToSummary} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A0817] mb-1.5">
                  Customer Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="checkout-customer-name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="e.g. Tanveer"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-[#2D2522] focus:outline-none focus:ring-2 transition-all ${
                    errors.customerName
                      ? "border-red-500 focus:ring-red-200"
                      : "border-[#5C0D20]/20 focus:ring-[#5C0D20]/20 focus:border-[#5C0D20]"
                  }`}
                />
                {errors.customerName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A0817] mb-1.5">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="checkout-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="03XX XXXXXXX"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-[#2D2522] focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-200"
                      : "border-[#5C0D20]/20 focus:ring-[#5C0D20]/20 focus:border-[#5C0D20]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A0817] mb-1.5">
                  Delivery Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={2}
                  id="checkout-delivery-address"
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryAddress: e.target.value })
                  }
                  placeholder="House / Flat #, Street, Colony in Chakwal"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-[#2D2522] focus:outline-none focus:ring-2 transition-all ${
                    errors.deliveryAddress
                      ? "border-red-500 focus:ring-red-200"
                      : "border-[#5C0D20]/20 focus:ring-[#5C0D20]/20 focus:border-[#5C0D20]"
                  }`}
                />
                {errors.deliveryAddress && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A0817] mb-1.5">
                  Area / Landmark (Optional)
                </label>
                <input
                  type="text"
                  id="checkout-landmark"
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({ ...formData, landmark: e.target.value })
                  }
                  placeholder="Near Tehsil Chowk / Talagang Road / City Hospital"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5C0D20]/20 text-sm text-[#2D2522] focus:outline-none focus:ring-2 focus:ring-[#5C0D20]/20 focus:border-[#5C0D20] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A0817] mb-1.5">
                  Order Notes / Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  id="checkout-notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Extra dip sauce, less spicy, cutlery requirements, etc."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5C0D20]/20 text-sm text-[#2D2522] focus:outline-none focus:ring-2 focus:ring-[#5C0D20]/20 focus:border-[#5C0D20] transition-all"
                />
              </div>

              {/* Order quick overview */}
              <div className="p-3.5 rounded-xl bg-[#F4EDE2] text-xs text-[#5C0D20] flex items-center justify-between font-semibold">
                <span>{items.reduce((s, i) => s + i.quantity, 0)} Items Selected</span>
                <span>Subtotal: {formatPrice(subtotal)}</span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors uppercase tracking-wider"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  id="checkout-continue-btn"
                  className="px-6 py-2.5 rounded-full bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#460816] transition-all shadow-md active:scale-95"
                >
                  Review Order Summary
                </button>
              </div>
            </form>
          ) : step === "summary" ? (
            /* Summary & WhatsApp Dispatch View */
            <div className="space-y-6">
              {/* Receipt Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#5C0D20]/15 shadow-sm font-sans">
                <div className="text-center pb-4 border-b border-dashed border-[#5C0D20]/20">
                  <h4 className="font-serif font-black text-xl text-[#4A0817]">
                    KANAF CAFE & BAKERY
                  </h4>
                  <p className="text-xs text-[#8A817C] mt-0.5">
                    Main Talagang Road, Chakwal
                  </p>
                  <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#5C0D20] text-[11px] font-bold">
                    Delivery Order
                  </div>
                </div>

                {/* Customer Details */}
                <div className="py-4 border-b border-dashed border-[#5C0D20]/20 space-y-1.5 text-xs text-[#4A4540]">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Customer:</span>
                    <span className="font-bold text-[#2D2522]">{formData.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <span className="font-bold text-[#2D2522]">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Delivery Address:</span>
                    <span className="font-bold text-right text-[#2D2522] max-w-[60%]">
                      {formData.deliveryAddress}
                    </span>
                  </div>
                  {formData.landmark && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Landmark:</span>
                      <span className="font-bold text-[#2D2522]">{formData.landmark}</span>
                    </div>
                  )}
                </div>

                {/* Ordered Items */}
                <div className="py-4 border-b border-[#5C0D20]/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F1F39] block mb-2">
                    ORDER
                  </span>
                  <div className="space-y-2 text-xs">
                    {items.map((ci) => (
                      <div key={ci.item.id} className="flex justify-between items-start">
                        <span className="text-[#2D2522]">
                          <span className="font-bold">{ci.quantity} ×</span> {ci.item.name}
                        </span>
                        <span className="font-semibold text-[#4A0817]">
                          {formatPrice(ci.item.price * ci.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculations */}
                <div className="pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Delivery in Chakwal:</span>
                    <span>FREE (Rs. 0)</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#4A0817] pt-2 border-t border-[#5C0D20]/15">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {formData.notes && (
                  <div className="mt-4 p-2.5 rounded-lg bg-[#FAF7F2] text-xs text-gray-600 border border-[#5C0D20]/10">
                    <span className="font-bold text-[#5C0D20]">Notes: </span>
                    {formData.notes}
                  </div>
                )}
              </div>

              {/* Delivery Service Callout */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <p className="font-bold text-sm">Dispatched via ARY SERVICES</p>
                  <p className="mt-0.5">
                    Your order will be instantly transmitted to ARY Services (WhatsApp: {settings?.aryWhatsApp || ARY_SERVICES_PHONE_DISPLAY}) with all items and customer details pre-filled.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  id="send-order-whatsapp-btn"
                  onClick={handleSendToWhatsApp}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-98"
                >
                  <Send className="w-5 h-5" />
                  <span>SEND ORDER TO ARY SERVICES</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="w-full py-2.5 text-xs font-bold text-[#5C0D20] hover:text-[#4A0817] transition-colors uppercase tracking-wider text-center"
                >
                  Edit Information
                </button>
              </div>
            </div>
          ) : (
            /* STEP 3: ORDER TRANSMITTED / WHATSAPP DISPATCHED */
            <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto text-[#25D366] shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-700 block mb-1">
                  Order Ref: #{orderRef}
                </span>
                <h4 className="font-serif font-black text-2xl text-[#4A0817]">
                  Order Sent to ARY Services!
                </h4>
                <p className="text-sm text-[#4A4540] mt-2 max-w-md mx-auto leading-relaxed">
                  A WhatsApp window has popped up to connect you directly with <strong>ARY Services</strong> at <strong className="text-emerald-700">{ARY_SERVICES_PHONE_DISPLAY}</strong> with your order ready.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#5C0D20]/10 text-xs text-left max-w-md mx-auto space-y-2 shadow-xs">
                <div className="flex justify-between font-medium text-gray-500">
                  <span>Customer:</span>
                  <span className="font-bold text-gray-800">{formData.customerName}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-500">
                  <span>Phone:</span>
                  <span className="font-bold text-gray-800">{formData.phone}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-500">
                  <span>Destination:</span>
                  <span className="font-bold text-gray-800 text-right max-w-[65%]">{formData.deliveryAddress}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-500 pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="font-bold text-[#4A0817] text-sm">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 max-w-md mx-auto">
                <a
                  id="open-whatsapp-popup-direct-link"
                  href={createdWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <Send className="w-5 h-5" />
                  <span>Open WhatsApp Window (0333 6554090)</span>
                </a>

                <button
                  type="button"
                  id="order-complete-close-btn"
                  onClick={() => {
                    onOrderSuccess();
                    onClose();
                  }}
                  className="w-full py-3 rounded-full bg-[#FAF7F2] border border-[#5C0D20]/20 text-[#5C0D20] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all"
                >
                  Done / Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
