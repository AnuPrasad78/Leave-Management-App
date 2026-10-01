import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveDetails from './pages/LeaveDetails';
import LeaveRequests from './pages/LeaveRequests';
import SeparationRequest from './pages/SeparationRequest';
import HolidayCalendar from './pages/HolidayCalendar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/leave-details" element={<LeaveDetails />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/separation-request" element={<SeparationRequest />} />
          <Route path="/holidays" element={<HolidayCalendar />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
