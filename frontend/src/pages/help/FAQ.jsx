import { useState } from "react"

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: "Orders & Delivery",
      questions: [
        {
          q: "How can I track my order?",
          a: "Go to 'My Orders' section, select your order, and click on 'Track Order'. You'll see real-time status updates and estimated delivery date. You'll also receive tracking updates via SMS and email."
        },
        {
          q: "Can I change my delivery address after placing an order?",
          a: "You can change the delivery address before the order is shipped. Go to 'My Orders', select the order, and click 'Edit Address'. Once shipped, address cannot be changed."
        },
        {
          q: "What is the estimated delivery time?",
          a: "Standard delivery takes 3-7 business days across India. Express delivery (1-2 days) is available in select metros. Delivery times may vary based on location and product availability."
        },
        {
          q: "Do you offer same-day or next-day delivery?",
          a: "Yes, we offer express delivery for select products in major cities. Check product page for availability of express delivery option."
        }
      ]
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept Credit/Debit Cards, UPI, Net Banking, Wallets (Paytm, PhonePe, etc.), Cash on Delivery, and EMI options on select products."
        },
        {
          q: "Is it safe to use my credit/debit card?",
          a: "Yes, absolutely safe. We use 256-bit SSL encryption and are PCI DSS compliant. We never store your CVV or card PIN."
        },
        {
          q: "When will I receive my refund?",
          a: "Refunds are processed within 2-3 days after item is received back. It takes 5-7 business days for the amount to reflect in your account depending on your payment method."
        },
        {
          q: "Are there any hidden charges?",
          a: "No hidden charges. All applicable charges including shipping, taxes, and COD fees (if any) are shown before you place the order."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "You can return most items within 7-30 days of delivery depending on the product category. Items must be unused and in original packaging with all tags intact."
        },
        {
          q: "How do I return a product?",
          a: "Go to 'My Orders', select the item to return, choose return reason, and schedule a pickup. Our delivery partner will collect the item from your address."
        },
        {
          q: "Is return pickup free?",
          a: "Yes, return pickup is free if the product is defective, damaged, or wrong item was delivered. For other returns, pickup charges may apply."
        },
        {
          q: "Can I exchange a product?",
          a: "We don't offer direct exchange currently. Please return the product and place a new order for the item you want."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' at the top right corner, enter your details (name, email, password), and click 'Create Account'. You can also sign up during checkout."
        },
        {
          q: "I forgot my password. What should I do?",
          a: "Click on 'Login' and then 'Forgot Password'. Enter your registered email, and we'll send you a password reset link."
        },
        {
          q: "How can I change my account details?",
          a: "Log in to your account, go to 'My Profile', and update your details. Don't forget to save changes."
        },
        {
          q: "Is my personal information safe?",
          a: "Yes, we take data security seriously. Your information is encrypted and stored securely. We never share your data with third parties without consent."
        }
      ]
    },
    {
      category: "Products",
      questions: [
        {
          q: "How do I know if a product is genuine?",
          a: "All products on ShopEz are 100% genuine. We work directly with brands and authorized distributors. Products come with manufacturer warranty and authenticity guarantee."
        },
        {
          q: "Are the product images accurate?",
          a: "Yes, we strive to show accurate product images. However, actual product color may vary slightly due to screen settings and lighting."
        },
        {
          q: "What if the product I want is out of stock?",
          a: "You can set a 'Notify Me' alert on the product page. We'll send you an email/SMS when the product is back in stock."
        },
        {
          q: "Do products come with warranty?",
          a: "Yes, eligible products come with manufacturer warranty. Warranty details are mentioned on the product page."
        }
      ]
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-600 mb-6">Home / Help / FAQ</div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Find answers to common questions about shopping on ShopEz
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <section key={categoryIndex} className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`
                  const isOpen = openIndex === globalIndex
                  
                  return (
                    <div key={faqIndex} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition"
                      >
                        <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="bg-gradient-to-r from-[#1f5fbf] to-[#174a9a] rounded-2xl p-8 mt-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="mb-6">Our customer support team is here to help you 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:18002029898"
              className="bg-white text-[#1f5fbf] px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition text-center"
            >
              Call 1800-202-9898
            </a>
            <a
              href="mailto:support@shopez.com"
              className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition border border-white/20 text-center"
            >
              Email Support
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FAQ
