function Payments() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-600 mb-6">Home / Help / Payments</div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Payment Options</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Multiple secure payment methods for your convenience
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Available Payment Methods</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Credit/Debit Cards</h3>
                <p className="text-slate-600 mb-2">We accept Visa, Mastercard, Maestro, RuPay, American Express, and Diners Club cards.</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Instant payment confirmation</li>
                  <li>Secure 3D authentication</li>
                  <li>Save cards for faster checkout</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">UPI</h3>
                <p className="text-slate-600 mb-2">Pay instantly using any UPI app like Google Pay, PhonePe, Paytm, or BHIM.</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Quick and secure transactions</li>
                  <li>No transaction fees</li>
                  <li>Instant payment confirmation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Net Banking</h3>
                <p className="text-slate-600 mb-2">Pay directly from your bank account. We support all major banks in India.</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Direct bank transfer</li>
                  <li>Secure payment gateway</li>
                  <li>Available for all major banks</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Wallets</h3>
                <p className="text-slate-600 mb-2">Use digital wallets like Paytm, PhonePe, Amazon Pay, and more.</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>One-click checkout</li>
                  <li>Cashback offers available</li>
                  <li>Instant payment</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Cash on Delivery (COD)</h3>
                <p className="text-slate-600 mb-2">Pay when you receive your order at your doorstep.</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Available on eligible products</li>
                  <li>Small COD fee may apply</li>
                  <li>Maximum order value: ₹50,000</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">EMI (Easy Monthly Installments)</h3>
                <p className="text-slate-600 mb-2">Buy now and pay later with No Cost EMI options.</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Available on select cards</li>
                  <li>Flexible tenure options (3-24 months)</li>
                  <li>No Cost EMI on select products</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Security</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your payment information is completely secure. We use industry-standard SSL encryption and comply with
              PCI DSS standards to protect your data.
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>256-bit SSL encryption for all transactions</li>
              <li>PCI DSS Level 1 compliant payment gateway</li>
              <li>Two-factor authentication for card payments</li>
              <li>We never store your CVV or card PIN</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Payment Issues</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Payment failed but amount debited</h3>
                <p className="text-slate-600">
                  If your payment failed but amount was debited, it will be automatically refunded to your account within 5-7 business days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Card declined</h3>
                <p className="text-slate-600">
                  Check if your card is activated for online transactions and has sufficient balance. Contact your bank if the issue persists.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">UPI transaction pending</h3>
                <p className="text-slate-600">
                  Wait for 30 minutes. If the status doesn't update, the amount will be refunded automatically.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Need Help?</h2>
            <p className="text-slate-600">
              Contact our 24/7 customer support at <span className="font-semibold">1800-202-9898</span> or email us at{" "}
              <a href="mailto:support@shopez.com" className="text-[#1f5fbf] hover:underline">support@shopez.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Payments
