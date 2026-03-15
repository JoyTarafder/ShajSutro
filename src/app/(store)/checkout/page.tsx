"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { state, subtotal, totalItems, clearCart } = useCart();

  const shipping = subtotal >= 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setOrderPlaced(true);
    setIsPlacingOrder(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-7">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-charcoal-950 mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-charcoal-400 mb-2 max-w-md font-light">
          Thank you for your purchase. We&apos;ve sent a confirmation email to{" "}
          <strong className="text-charcoal-700 font-medium">{shippingInfo.email || "your email"}</strong>.
        </p>
        <p className="text-sm text-charcoal-300 mb-9 font-light">
          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()} &middot; Estimated delivery: 3&ndash;5 business days
        </p>
        <div className="flex gap-3">
          <Link href="/" className="btn-secondary">Back to Home</Link>
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-charcoal-950 mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary mt-4">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="text-xl font-bold text-charcoal-950 tracking-tight">ShajSutro</Link>
          <Link href="/cart" className="text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors duration-300 group flex items-center gap-1.5">
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </Link>
        </div>

        <div className="flex items-center justify-center mb-12">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => idx < currentStep && setCurrentStep(idx)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    idx < currentStep
                      ? "bg-green-600 text-white cursor-pointer hover:bg-green-700"
                      : idx === currentStep
                      ? "bg-charcoal-950 text-white"
                      : "bg-charcoal-200 text-charcoal-400"
                  }`}
                >
                  {idx < currentStep ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </button>
                <span className={`text-xs mt-2 font-medium ${idx === currentStep ? "text-charcoal-950" : "text-charcoal-300"}`}>
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-24 sm:w-36 h-0.5 mx-4 mb-5 transition-colors duration-400 ${idx < currentStep ? "bg-green-400" : "bg-charcoal-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-soft border border-charcoal-100">

              {currentStep === 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-charcoal-950 mb-7">Shipping Information</h2>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">First Name</label>
                      <input className="input-field" placeholder="John" value={shippingInfo.firstName} onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">Last Name</label>
                      <input className="input-field" placeholder="Doe" value={shippingInfo.lastName} onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
                      <input className="input-field" type="email" placeholder="john@example.com" value={shippingInfo.email} onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">Phone Number</label>
                      <input className="input-field" type="tel" placeholder="+1 (555) 000-0000" value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">Street Address</label>
                      <input className="input-field" placeholder="123 Main Street, Apt 4B" value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">City</label>
                      <input className="input-field" placeholder="New York" value={shippingInfo.city} onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">State</label>
                      <input className="input-field" placeholder="NY" value={shippingInfo.state} onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">ZIP Code</label>
                      <input className="input-field" placeholder="10001" value={shippingInfo.zip} onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">Country</label>
                      <select className="input-field" value={shippingInfo.country} onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="btn-primary w-full mt-7">
                    Continue to Payment
                  </button>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-charcoal-950 mb-7">Payment Details</h2>

                  <div className="flex gap-2 mb-7">
                    {["Visa", "MC", "Amex", "PayPal"].map((card) => (
                      <span key={card} className="px-3.5 py-2 text-xs font-medium text-charcoal-400 bg-charcoal-50 border border-charcoal-200 rounded-lg">
                        {card}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">Card Number</label>
                      <div className="relative">
                        <input
                          className="input-field pr-12"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={paymentInfo.cardNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                            const formatted = val.replace(/(.{4})/g, "$1 ").trim();
                            setPaymentInfo({...paymentInfo, cardNumber: formatted});
                          }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-5 text-charcoal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal-600 mb-2">Name on Card</label>
                      <input className="input-field" placeholder="John Doe" value={paymentInfo.cardName} onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 mb-2">Expiry Date</label>
                        <input
                          className="input-field"
                          placeholder="MM / YY"
                          maxLength={7}
                          value={paymentInfo.expiry}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                            const formatted = val.length >= 2 ? val.slice(0, 2) + " / " + val.slice(2) : val;
                            setPaymentInfo({...paymentInfo, expiry: formatted});
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal-600 mb-2">CVV</label>
                        <input className="input-field" placeholder="123" maxLength={4} type="password" value={paymentInfo.cvv} onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, "").slice(0, 4)})} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5 text-xs text-charcoal-400">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span className="font-light">Your payment info is encrypted and secure.</span>
                  </div>

                  <div className="flex gap-3 mt-7">
                    <button onClick={() => setCurrentStep(0)} className="btn-secondary flex-1">Back</button>
                    <button onClick={() => setCurrentStep(2)} className="btn-primary flex-1">Review Order</button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-charcoal-950 mb-7">Review Your Order</h2>

                  <div className="space-y-6">
                    <div className="bg-warm-50 rounded-xl p-5 border border-warm-100">
                      <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-sm font-semibold text-charcoal-900">Shipping to</h3>
                        <button onClick={() => setCurrentStep(0)} className="text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors">Edit</button>
                      </div>
                      <p className="text-sm text-charcoal-500 font-light">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address && <>{shippingInfo.address}<br /></>}
                        {shippingInfo.city && `${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}`}
                      </p>
                    </div>

                    <div className="bg-warm-50 rounded-xl p-5 border border-warm-100">
                      <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-sm font-semibold text-charcoal-900">Payment</h3>
                        <button onClick={() => setCurrentStep(1)} className="text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors">Edit</button>
                      </div>
                      <p className="text-sm text-charcoal-500 font-light">
                        {paymentInfo.cardNumber ? `**** **** **** ${paymentInfo.cardNumber.slice(-4)}` : "Card details entered"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-charcoal-900 mb-4">Items ({totalItems})</h3>
                      <div className="space-y-3">
                        {state.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-warm-50 flex-shrink-0 shadow-soft">
                              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="56px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-charcoal-900 truncate">{item.product.name}</p>
                              <p className="text-xs text-charcoal-400 font-light">{item.size} &middot; {item.color} &middot; Qty {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-charcoal-900 flex-shrink-0">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-9">
                    <button onClick={() => setCurrentStep(1)} className="btn-secondary flex-1">Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="btn-accent flex-1 relative"
                    >
                      {isPlacingOrder ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Place Order \u00B7 $${total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-7 shadow-soft border border-charcoal-100 sticky top-28">
              <h3 className="text-base font-semibold text-charcoal-950 mb-6">Order Summary</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {state.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3.5">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-warm-50 flex-shrink-0 shadow-soft">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="48px" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-charcoal-700 text-white text-[10px] flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-charcoal-300 font-light">{item.size}</p>
                    </div>
                    <span className="text-xs font-semibold text-charcoal-900 flex-shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-charcoal-100 mt-6 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-charcoal-500">
                  <span className="font-light">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal-500">
                  <span className="font-light">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-charcoal-500">
                  <span className="font-light">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-charcoal-100 pt-3 flex justify-between font-semibold text-charcoal-950">
                  <span>Total</span>
                  <span className="text-base">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
