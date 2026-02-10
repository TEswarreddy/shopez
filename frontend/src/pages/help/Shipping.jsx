function Shipping() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-600 mb-6">Home / Help / Shipping</div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Shipping Policy</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Fast and reliable delivery across India
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Delivery Timeline</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-1">Express Delivery</h3>
                <p className="text-slate-600">1-2 business days for select metros and cities</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-1">Standard Delivery</h3>
                <p className="text-slate-600">3-7 business days across India</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-1">Remote Areas</h3>
                <p className="text-slate-600">7-14 business days for remote locations</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              * Delivery times may vary based on product availability and location
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipping Charges</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 text-slate-900 font-semibold">Order Value</th>
                    <th className="text-left py-3 text-slate-900 font-semibold">Shipping Charge</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="py-3">Above ₹500</td>
                    <td className="py-3 text-green-600 font-semibold">FREE</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3">₹200 - ₹499</td>
                    <td className="py-3">₹40</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3">Below ₹200</td>
                    <td className="py-3">₹70</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Tracking</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Track your order status in real-time:
            </p>
            <ol className="list-decimal list-inside text-slate-600 space-y-2">
              <li>Go to "My Orders" section</li>
              <li>Click on the order you want to track</li>
              <li>View real-time status and estimated delivery date</li>
              <li>Get tracking ID for courier partner updates</li>
            </ol>
            <p className="text-slate-600 mt-4">
              You'll also receive SMS and email notifications at every stage of delivery.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Delivery Process</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1f5fbf] text-white flex items-center justify-center font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Order Confirmation</h3>
                  <p className="text-slate-600">You'll receive an order confirmation email/SMS immediately</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1f5fbf] text-white flex items-center justify-center font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Processing</h3>
                  <p className="text-slate-600">Your order is packed and prepared for shipment</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1f5fbf] text-white flex items-center justify-center font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Shipped</h3>
                  <p className="text-slate-600">Order dispatched with tracking details</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1f5fbf] text-white flex items-center justify-center font-semibold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Out for Delivery</h3>
                  <p className="text-slate-600">Your order is on its way to you</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Delivered</h3>
                  <p className="text-slate-600">Order successfully delivered to your address</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Important Information</h2>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Please provide accurate delivery address and contact details</li>
              <li>Someone must be available to receive the order</li>
              <li>ID proof may be required for certain high-value items</li>
              <li>Weekend and public holiday deliveries may be limited in some areas</li>
              <li>We don't deliver to PO Box addresses</li>
            </ul>
          </section>

          <section className="bg-slate-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Shipping Issues?</h2>
            <p className="text-slate-600">
              Contact our customer support at <span className="font-semibold">1800-202-9898</span> or email{" "}
              <a href="mailto:support@shopez.com" className="text-[#1f5fbf] hover:underline">support@shopez.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Shipping
