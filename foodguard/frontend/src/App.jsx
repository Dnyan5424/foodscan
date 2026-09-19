import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastProvider } from './components/Toast'
import { AuthProvider } from './context/AuthContext'

import Home from './pages/Home'
import ExpiryTracker from './pages/ExpiryTracker'
import ProductScanner from './pages/ProductScanner'
import BarcodeScanner from './pages/BarcodeScanner'
import GuardScan from './pages/GuardScan'
import Complaints from './pages/Complaints'
import AdulterationGuide from './pages/AdulterationGuide'
import AdulterationDetail from './pages/AdulterationDetail'
import Awareness from './pages/Awareness'
import MythVsFact from './pages/MythVsFact'
import Quiz from './pages/Quiz'
import Assistant from './pages/Assistant'
import GovResources from './pages/GovResources'
import CommunityDashboard from './pages/CommunityDashboard'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guardscan" element={<GuardScan />} />
            <Route path="/expiry-tracker" element={<ExpiryTracker />} />
            <Route path="/expiry-tracker/scan" element={<ProductScanner />} />
            <Route path="/expiry-tracker/scan-barcode" element={<BarcodeScanner />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/adulteration-guide" element={<AdulterationGuide />} />
            <Route path="/adulteration-guide/:slug" element={<AdulterationDetail />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/awareness/myth-vs-fact" element={<MythVsFact />} />
            <Route path="/awareness/quiz" element={<Quiz />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/resources" element={<GovResources />} />
            <Route path="/community" element={<CommunityDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </ToastProvider>
    </AuthProvider>
  )
}