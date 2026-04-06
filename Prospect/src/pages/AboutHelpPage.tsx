import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, Phone, MessageCircle, Globe, Shield, FileText, ExternalLink, ChevronRight } from 'lucide-react';

export const AboutHelpPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy/5 rounded-full mb-6">
          <HelpCircle className="w-4 h-4 text-navy" />
          <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Support Center</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 uppercase tracking-tight">
          How can we <span className="text-secondary">help</span>?
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-normal max-w-2xl mx-auto">
          Find answers to common questions, learn about our methodology, or get in touch with our team of career advisors.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="mb-20">
        <h2 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: "How accurate is the RIASEC assessment?", a: "The RIASEC model is a globally recognized psychological framework for career matching. While highly accurate in identifying interest patterns, we recommend using it as a starting point for further exploration." },
            { q: "Is Prospect SA free to use?", a: "Yes! Our core features, including the quiz, APS calculator, and bursary finder, are completely free for all South African students." },
            { q: "How often is the bursary data updated?", a: "We update our bursary database weekly to ensure you have access to the latest funding opportunities and deadlines." },
            { q: "Can I save my results without an account?", a: "Some data is saved locally on your device, but to access your results across different devices and ensure they aren't lost, we recommend creating a free account." },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-navy mb-3">{item.q}</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { icon: Mail, label: 'Email Support', value: 'support@prospectsa.co.za', color: 'text-secondary', bg: 'bg-secondary/10' },
          { icon: MessageCircle, label: 'WhatsApp Bot', value: '+27 21 555 0123', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Globe, label: 'Social Media', value: '@prospect_sa', color: 'text-navy', bg: 'bg-navy/5' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition-all">
            <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest mb-2">{item.label}</h4>
            <p className="text-xs font-bold text-secondary">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Legal & About */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8">Our Mission</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
            Prospect SA was founded with a single goal: to bridge the information gap for South African students. We believe that every student, regardless of their background, deserves access to high-quality career guidance and funding opportunities.
          </p>
          <button className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
            Read Our Story
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        <section>
          <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8">Legal & Privacy</h3>
          <div className="space-y-4">
            {[
              { label: 'Privacy Policy', icon: Shield },
              { label: 'Terms of Service', icon: FileText },
              { label: 'Data Protection (POPIA)', icon: Shield },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-secondary transition-all group">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-navy/40 group-hover:text-secondary transition-colors" />
                  <span className="text-xs font-bold text-navy uppercase tracking-wider">{item.label}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-navy/20 group-hover:text-secondary transition-colors" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
