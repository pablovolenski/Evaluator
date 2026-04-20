import Link from 'next/link';

const features = [
  { icon: '📊', title: 'Full Financial Modeling', desc: 'Add initial investments, recurring expenses, and demand projections with custom periods.' },
  { icon: '🧮', title: 'Automatic Evaluation', desc: 'Get NPV, IRR, Payback Period and ROI calculated instantly as you build your project.' },
  { icon: '📎', title: 'Evidence Attachments', desc: 'Attach quotations, contracts, or any supporting file to each line item.' },
  { icon: '🔗', title: 'Shareable Results', desc: 'One-click sharing with a public page optimized for social media previews.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">Evalify</span>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">Sign in</Link>
            <Link href="/register" className="text-sm bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1 text-sm text-indigo-700 mb-6 font-medium">
          Economic Project Evaluation
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Evaluate your business idea<br />
          <span className="text-indigo-600">with confidence</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Evalify helps you systematize your business ideas, run professional economic evaluations,
          and share results with investors and partners — all in one place.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="inline-flex items-center rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
            Start for free
          </Link>
          <Link href="/login" className="inline-flex items-center rounded-xl border border-gray-300 px-7 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to evaluate a project
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics showcase */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Professional metrics, zero spreadsheets
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Evalify calculates the four key metrics every serious project evaluation needs.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'NPV', desc: 'Net Present Value', color: 'indigo' },
            { label: 'IRR', desc: 'Internal Rate of Return', color: 'violet' },
            { label: 'Payback', desc: 'Payback Period', color: 'sky' },
            { label: 'ROI', desc: 'Return on Investment', color: 'emerald' },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-center">
              <p className="text-2xl font-black text-indigo-600">{m.label}</p>
              <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to evaluate your idea?</h2>
        <p className="mt-2 text-indigo-200 text-lg">Free, no credit card required.</p>
        <Link href="/register" className="mt-6 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
          Create your account
        </Link>
      </section>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} Evalify — Economic project evaluation platform
      </footer>
    </div>
  );
}
