function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-600 mb-6">Home / Policies / Privacy Policy</div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600">Last updated: February 10, 2026</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Personal Information</h3>
              <p className="text-slate-600 leading-relaxed mb-2">When you create an account or make a purchase, we collect:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Delivery address</li>
                <li>Payment information (processed securely by payment gateways)</li>
                <li>Order history and preferences</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Automatically Collected Information</h3>
              <p className="text-slate-600 leading-relaxed mb-2">We automatically collect:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (with your permission)</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about orders, products, and services</li>
              <li>Personalize your shopping experience</li>
              <li>Improve our platform and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns and optimize user experience</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Service Providers</h3>
                <p className="text-slate-600">Third-party vendors who help us operate our business (payment processors, delivery partners, email services)</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Sellers</h3>
                <p className="text-slate-600">Vendors fulfilling your orders receive necessary delivery information</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Legal Requirements</h3>
                <p className="text-slate-600">When required by law or to protect our rights</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Business Transfers</h3>
                <p className="text-slate-600">In connection with mergers, acquisitions, or sale of assets</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>256-bit SSL encryption for data transmission</li>
              <li>Secure data storage with encryption at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>PCI DSS compliance for payment processing</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights and Choices</h2>
            <p className="text-slate-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li><span className="font-semibold">Access:</span> Request a copy of your personal information</li>
              <li><span className="font-semibold">Correction:</span> Update or correct inaccurate information</li>
              <li><span className="font-semibold">Deletion:</span> Request deletion of your account and data</li>
              <li><span className="font-semibold">Opt-out:</span> Unsubscribe from marketing communications</li>
              <li><span className="font-semibold">Data Portability:</span> Request your data in a portable format</li>
              <li><span className="font-semibold">Restrict Processing:</span> Limit how we use your information</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@shopez.com or through your account settings.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience. Types of cookies we use:
            </p>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-slate-900">Essential Cookies:</span>
                <span className="text-slate-600 ml-2">Required for basic site functionality</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Analytics Cookies:</span>
                <span className="text-slate-600 ml-2">Help us understand site usage</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Marketing Cookies:</span>
                <span className="text-slate-600 ml-2">Used for personalized advertising</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect site functionality.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Children's Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Our services are not intended for children under 18. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Data Retention</h2>
            <p className="text-slate-600 leading-relaxed">
              We retain your information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. You can request deletion of your account at any time.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Changes to Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this policy periodically. We will notify you of significant changes via email or prominent notice on our platform. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              For privacy-related questions or concerns, contact our Data Protection Officer:
            </p>
            <p className="text-slate-600">Email: privacy@shopez.com</p>
            <p className="text-slate-600">Phone: 1800-202-9898</p>
            <address className="not-italic text-slate-600 mt-2">
              Data Protection Officer<br />
              ShopEz Internet Private Limited<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village<br />
              Outer Ring Road, Devarabeesanahalli Village<br />
              Bengaluru, 560103, Karnataka, India
            </address>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Privacy
