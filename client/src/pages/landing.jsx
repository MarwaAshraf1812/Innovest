import React from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/shared/Footer'
import Hero from '../features/landing/components/Hero'
import Stats from '../features/landing/components/Stats'
import ExclusiveNetwork from '../features/landing/components/ExclusiveNetwork'
import Services from '../features/landing/components/Services'
import HowItWorks from '../features/landing/components/HowItWorks'
import Testimonials from '../features/landing/components/Testimonials'
import CommunityCallouts from '../features/landing/components/CommunityCallouts'
import Faq from '../features/landing/components/Faq'

export default function LandingPage({ onNavigate, currentUser, onLogout }) {

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
      
      <Navbar 
        activePage="home"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main>
        <Hero onNavigate={onNavigate} currentUser={currentUser} />
        <Stats />
        <ExclusiveNetwork onNavigate={onNavigate} currentUser={currentUser} />
        <Services id="features" />
        <HowItWorks id="how-it-works" />
        <Testimonials id="testimonials" />
        <CommunityCallouts onNavigate={onNavigate} currentUser={currentUser} />
        <Faq id="faq" />
      </main>

      <Footer onNavigate={onNavigate} />

    </div>
  )
}
