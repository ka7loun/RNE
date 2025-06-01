import React from 'react';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import DenominationSimulator from './components/DenominationSimulator';
import AIChatButton from './components/AIChatButton';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <DenominationSimulator />
        </main>
      </div>
      <AIChatButton />
      <Footer />
    </div>
  );
}

export default App;