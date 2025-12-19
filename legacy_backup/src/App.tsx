import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/pages/HomePage';
import { MainTimelinePage } from './components/pages/MainTimelinePage';
import { HighlightsPage } from './components/pages/HighlightsPage';
import { VideoHistoryPage } from './components/pages/VideoHistoryPage';
import { StatisticsPage } from './components/pages/StatisticsPage';
import { ArchivePage } from './components/pages/ArchivePage';
import { EventsPage } from './components/pages/EventsPage';
import { NewsPage } from './components/pages/NewsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/maintimeline" element={<MainTimelinePage />} />
        <Route path="/highlights" element={<HighlightsPage />} />
        <Route path="/video-history" element={<VideoHistoryPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
    </Router>
  );
}
