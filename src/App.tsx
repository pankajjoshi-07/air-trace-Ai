import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { HchoAnalysis } from './pages/HchoAnalysis';
import { FireDetection } from './pages/FireDetection';
import { WindAnalysis } from './pages/WindAnalysis';
import { AiSourceAttribution } from './pages/AiSourceAttribution';
import { Analytics } from './pages/Analytics';
import { DecisionSupport } from './pages/DecisionSupport';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { Layout } from './components/Layout';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  // Renders the route target wrapped in the layout with a transition animation
  const renderWithLayout = (Component: React.ComponentType) => (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Component />
      </motion.div>
    </Layout>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing page is a standalone immersive experience */}
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Landing />
          </motion.div>
        } />
        
        {/* Swath dashboards wrapped in the Mission Control telemetry layouts */}
        <Route path="/dashboard" element={renderWithLayout(Dashboard)} />
        <Route path="/live" element={renderWithLayout(LiveMonitoring)} />
        <Route path="/hcho" element={renderWithLayout(HchoAnalysis)} />
        <Route path="/fire" element={renderWithLayout(FireDetection)} />
        <Route path="/wind" element={renderWithLayout(WindAnalysis)} />
        <Route path="/source-attribution" element={renderWithLayout(AiSourceAttribution)} />
        <Route path="/analytics" element={renderWithLayout(Analytics)} />
        <Route path="/decision-support" element={renderWithLayout(DecisionSupport)} />
        <Route path="/reports" element={renderWithLayout(Reports)} />
        <Route path="/settings" element={renderWithLayout(Settings)} />
        <Route path="/about" element={renderWithLayout(About)} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default App;
