/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataSaverProvider } from './contexts/DataSaverContext';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import { LandingPageWrapper } from './components/LandingPageWrapper';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { QuizPage } from './pages/QuizPage';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { APSCalculatorPage } from './pages/APSCalculatorPage';
import { CareerBrowserPage } from './pages/CareerBrowserPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { BursaryFinderPage } from './pages/BursaryFinderPage';
import { SubjectSelectorPage } from './pages/SubjectSelectorPage';
import { StudyLibraryPage } from './pages/StudyLibraryPage';
import { StudyTopicPage } from './pages/StudyTopicPage';
import { BursaryEligibilityPage } from './pages/BursaryEligibilityPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { AboutHelpPage } from './pages/AboutHelpPage';

export default function App() {
  return (
    <Router>
      <DataSaverProvider>
        <AuthProvider>
          <QuizProvider>
            <Routes>
              {/* Landing Page (No Header/Footer) */}
              <Route path="/" element={<LandingPageWrapper />} />

              {/* Auth Routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/signup" element={<Navigate to="/auth" replace />} />

              {/* Main App Routes (With Header/Footer) */}
              <Route element={<Layout />}>
                <Route element={<ProtectedRoute allowGuest={true} />}>
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/quiz/results" element={<QuizResultsPage />} />
                  <Route path="/aps-calculator" element={<APSCalculatorPage />} />
                  <Route path="/careers" element={<CareerBrowserPage />} />
                  <Route path="/careers/:id" element={<CareerDetailPage />} />
                  <Route path="/bursaries" element={<BursaryFinderPage />} />
                  <Route path="/bursary-eligibility" element={<BursaryEligibilityPage />} />
                  <Route path="/subject-selector" element={<SubjectSelectorPage />} />
                  <Route path="/library" element={<StudyLibraryPage />} />
                  <Route path="/library/:subjectId/:grade/:term" element={<StudyTopicPage />} />
                  <Route path="/about" element={<AboutHelpPage />} />
                </Route>
                
                {/* Protected Routes (Authenticated Only) */}
                <Route element={<ProtectedRoute allowGuest={false} />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </QuizProvider>
        </AuthProvider>
      </DataSaverProvider>
    </Router>
  );
}
