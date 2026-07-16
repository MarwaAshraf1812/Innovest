import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Faq({ id }) {
  const [openFaq, setOpenFaq] = useState(null)

  const faqItems = [
    {
      question: "What is the role of the platform?",
      answer: "Innovest acts as a matchmaker connecting local initiatives and startups with qualified sponsors and investors. It eliminates the payment processing overhead in the early negotiations, focusing entirely on secure project visibility and documentation alignment."
    },
    {
      question: "How is security managed?",
      answer: "We employ Role-Based Access Control (RBAC) to ensure that only approved investors and entrepreneurs can view sensitive documents. Authentication is secured via HTTP-only JWT cookies and password hashing using bcrypt."
    },
    {
      question: "Can entrepreneurs join globally?",
      answer: "Yes. Entrepreneurs from any region can submit their project proposals, funding goals, and business deadlines. However, each profile and project undergoes a verification audit by our administrators before listing."
    },
    {
      question: "Are there community verification rules?",
      answer: "Indeed. All group channels and community pages require join approval. Admins or moderators review all pending requests to prevent spam and ensure compliance with our professional network rules."
    },
    {
      question: "Is there support for emerging sectors?",
      answer: "Yes, we support fields ranging from Biotech and Cleantech to Deeptech and Software services. Projects can be searched and filtered by fields to make finding specific innovations simple."
    },
    {
      question: "How do I start communication?",
      answer: "Once a project is approved, investors can submit expressions of interest or direct proposals. Communication is facilitated in real-time using built-in notifications and Socket.IO workflows."
    }
  ]

  return (
    <section id={id} className="py-20 bg-white scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 px-3.5 py-1 rounded-full border border-primary-100">
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Investment Insights Hub</h2>
          <p className="text-slate-550 text-sm">The questions, answered.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div 
              key={idx} 
              className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-slate-800 font-semibold hover:bg-slate-100/50 transition-all cursor-pointer bg-transparent border-none"
              >
                <span className="text-sm sm:text-base">{item.question}</span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary-600' : ''}`} />
              </button>
              
              <div className={`transition-all duration-350 ease-in-out overflow-hidden ${openFaq === idx ? 'max-h-40 border-t border-slate-200/60' : 'max-h-0'}`}>
                <div className="px-6 py-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white/60">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
