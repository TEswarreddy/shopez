function Orders() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h2>
          <p className="text-slate-600 mb-6">Your order history will appear here.</p>
          <a
            href="/"
            className="inline-block bg-[#1f5fbf] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a4da0] transition"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  )
}

export default Orders
