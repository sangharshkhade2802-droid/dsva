import React, { useState } from 'react';
import { NavSection } from './engine/types';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { SearchModal } from './components/common/SearchModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { DashboardView } from './views/DashboardView';
import { DataStructuresView } from './views/DataStructuresView';
import { AlgorithmsView } from './views/AlgorithmsView';
import { SortingVisualizer } from './components/visualizers/SortingVisualizer';
import { SearchingVisualizer } from './components/visualizers/SearchingVisualizer';
import { GraphVisualizer } from './components/visualizers/GraphVisualizer';
import { ComplexityCharts } from './components/analyzer/ComplexityCharts';
import { PlaygroundView } from './views/PlaygroundView';
import { LearningView } from './views/LearningView';
import { AboutView } from './views/AboutView';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    onOpenSearch: () => setIsSearchOpen(true),
  });

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Body with Sidebar + Content Stage */}
      <div className="flex-1 flex w-full">
        {/* Responsive Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        {/* View Content Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-full overflow-x-hidden">
          {activeSection === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {activeSection === 'data_structures' && <DataStructuresView />}
          {activeSection === 'algorithms' && <AlgorithmsView onNavigate={handleNavigate} />}
          {activeSection === 'sorting' && <SortingVisualizer />}
          {activeSection === 'searching' && <SearchingVisualizer />}
          {activeSection === 'graph' && <GraphVisualizer />}
          {activeSection === 'complexity' && <ComplexityCharts />}
          {activeSection === 'playground' && <PlaygroundView />}
          {activeSection === 'learning' && <LearningView />}
          {activeSection === 'about' && <AboutView />}
        </main>
      </div>

      {/* Global Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(section) => {
          handleNavigate(section);
        }}
      />
    </div>
  );
};

export default App;
