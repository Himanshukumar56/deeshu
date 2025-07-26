import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Scrapbook from './components/Scrapbook';
import Communication from './components/Communication';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FindPartner from './components/FindPartner';
import SharedCalendar from './components/SharedCalendar';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import Memories from './components/Memories';
import Notes from './components/Notes';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 font-poppins">
      <Toaster position="top-center" reverseOrder={false} />
      {user && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scrapbook"
          element={
            <ProtectedRoute>
              <Scrapbook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communication"
          element={
            <ProtectedRoute>
              <Communication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared-calendar"
          element={
            <ProtectedRoute>
              <SharedCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-partner"
          element={
            <ProtectedRoute>
              <FindPartner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memories"
          element={
            <ProtectedRoute>
              <Memories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
