import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileTabBar } from './components/MobileTabBar';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { DocumentScannerPage } from './pages/DocumentScannerPage';
import { FamilyCalculatorPage } from './pages/FamilyCalculatorPage';
import { LifeEventsPage } from './pages/LifeEventsPage';
import { BoardsPage } from './pages/BoardsPage';
import { TrackerPage } from './pages/TrackerPage';
import { ScamShieldPage } from './pages/ScamShieldPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { CentresMapPage } from './pages/CentresMapPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { useUIStore } from './store/uiStore';

export const App = () => {
  const { darkMode } = useUIStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-saathi-bg text-saathi-ink flex flex-col bg-grain transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Left Rail */}
        <Sidebar />

        {/* Main Content View */}
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-12 min-w-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ask" element={<VoiceAssistantPage />} />
            <Route path="/scan" element={<DocumentScannerPage />} />
            <Route path="/family" element={<FamilyCalculatorPage />} />
            <Route path="/events" element={<LifeEventsPage />} />
            <Route path="/boards" element={<BoardsPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/scam" element={<ScamShieldPage />} />
            <Route path="/impact" element={<ImpactDashboardPage />} />
            <Route path="/centres" element={<CentresMapPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>

      {/* Floating Notifications */}
      <ToastContainer />

      {/* Mobile-first Bottom Bar */}
      <MobileTabBar />
    </div>
  );
};

export default App;
