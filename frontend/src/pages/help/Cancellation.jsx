function Cancellation() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-600 mb-6">Home / Help / Cancellation & Returns</div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Cancellation & Returns</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Easy returns and cancellations for a hassle-free shopping experience
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Cancellation</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How to Cancel</h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Go to "My Orders" section</li>
                <li>Select the order you want to cancel</li>
                <li>Click on "Cancel Order" button</li>
                <li>Select cancellation reason and confirm</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-slate-700">
                <span className="font-semibold">Note:</span> You can cancel your order before it's shipped. Once shipped, you'll need to return it after delivery.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Cancellation Timeline</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><span className="font-semibold">Before Shipping:</span> Instant cancellation with full refund</li>
                <li><span className="font-semibold">After Shipping:</span> Cannot cancel, but you can return after delivery</li>
                <li><span className="font-semibold">Delivered:</span> Use return option within return window</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Returns Policy</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Return Window</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#1f5fbf] mb-1">7 Days</div>
                  <p className="text-slate-600 text-sm">Electronics & Appliances</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#1f5fbf] mb-1">10 Days</div>
                  <p className="text-slate-600 text-sm">Fashion & Lifestyle</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#1f5fbf] mb-1">30 Days</div>
                  <p className="text-slate-600 text-sm">Books & Media</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How to Return</h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Go to "My Orders" and select the item to return</li>
                <li>Click "Return" and select reason</li>
                <li>Choose pickup slot or drop-off location</li>
                <li>Our delivery partner will collect the item</li>
                <li>Refund initiated after quality check (2-3 days)</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Return Conditions</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Product must be unused and in original packaging</li>
                <li>All tags, labels, and accessories must be intact</li>
                <li>Product should not be damaged or altered</li>
                <li>Original invoice must be returned with the product</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Refund Process</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Refund Timeline</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 text-slate-900 font-semibold">Payment Method</th>
                        <th className="text-left py-3 text-slate-900 font-semibold">Refund Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-b border-slate-100">
                        <td className="py-3">UPI / Cards</td>
                        <td className="py-3">5-7 business days</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3">Net Banking</td>
                        <td className="py-3">7-10 business days</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3">Wallets</td>
                        <td className="py-3">Instant to 24 hours</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3">Cash on Delivery</td>
                        <td className="py-3">10-14 business days (Bank transfer)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Refund Amount</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li>Full product price will be refunded</li>
                  <li>Shipping charges refunded if product is defective/wrong</li>
                  <li>For returns due to change of mind, shipping charges may not be refunded</li>
                  <li>COD charges are non-refundable</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Exchange Policy</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Currently, we don't offer direct exchange. Please return the product and place a new order for the item you want.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-slate-700">
                <span className="font-semibold">Pro Tip:</span> Order your replacement first to avoid stock issues, then return the original item.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Non-Returnable Items</h2>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Innerwear, lingerie, socks, and other intimate apparel</li>
              <li>Cosmetics, perfumes, and personal care items (if opened)</li>
              <li>Grocery items and perishables</li>
              <li>Products without original tags or packaging</li>
              <li>Customized or personalized products</li>
              <li>Software and digital products</li>
            </ul>
          </section>

          <section className="bg-slate-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Need Help with Returns?</h2>
            <p className="text-slate-600">
              Contact us at <span className="font-semibold">1800-202-9898</span> or email{" "}
              <a href="mailto:returns@shopez.com" className="text-[#1f5fbf] hover:underline">returns@shopez.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Cancellation
