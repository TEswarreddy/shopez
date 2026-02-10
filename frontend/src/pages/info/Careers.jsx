function Careers() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-600 mb-6">Home / Careers</div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Careers at ShopEz</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Join our team and help shape the future of e-commerce in India
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Work With Us?</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              At ShopEz, we're building more than just an e-commerce platform - we're creating experiences that delight
              millions of customers every day. Join us to work on challenging problems at scale.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="border-l-4 border-[#1f5fbf] pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Innovation Culture</h3>
                <p className="text-slate-600">Work with cutting-edge technologies and innovative solutions</p>
              </div>
              <div className="border-l-4 border-[#1f5fbf] pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Growth Opportunities</h3>
                <p className="text-slate-600">Continuous learning and career development programs</p>
              </div>
              <div className="border-l-4 border-[#1f5fbf] pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Competitive Benefits</h3>
                <p className="text-slate-600">Industry-leading compensation and benefits package</p>
              </div>
              <div className="border-l-4 border-[#1f5fbf] pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Work-Life Balance</h3>
                <p className="text-slate-600">Flexible work arrangements and supportive environment</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Open Positions</h2>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-6 hover:border-[#1f5fbf] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Senior Software Engineer</h3>
                    <p className="text-slate-600 mt-1">Engineering • Bengaluru</p>
                    <p className="text-sm text-slate-500 mt-2">Full Stack Development, React, Node.js</p>
                  </div>
                  <button className="bg-[#1f5fbf] text-white px-6 py-2 rounded-lg hover:bg-[#174a9a] transition">
                    Apply
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6 hover:border-[#1f5fbf] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Product Manager</h3>
                    <p className="text-slate-600 mt-1">Product • Bengaluru</p>
                    <p className="text-sm text-slate-500 mt-2">E-commerce, User Experience, Analytics</p>
                  </div>
                  <button className="bg-[#1f5fbf] text-white px-6 py-2 rounded-lg hover:bg-[#174a9a] transition">
                    Apply
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6 hover:border-[#1f5fbf] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Data Scientist</h3>
                    <p className="text-slate-600 mt-1">Data Science • Bengaluru</p>
                    <p className="text-sm text-slate-500 mt-2">Machine Learning, Python, Analytics</p>
                  </div>
                  <button className="bg-[#1f5fbf] text-white px-6 py-2 rounded-lg hover:bg-[#174a9a] transition">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Apply</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Send your resume and cover letter to <a href="mailto:careers@shopez.com" className="text-[#1f5fbf] hover:underline">careers@shopez.com</a>
            </p>
            <p className="text-slate-600 leading-relaxed">
              For more information about our hiring process and open positions, please visit our LinkedIn page or
              contact our HR team.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Careers
