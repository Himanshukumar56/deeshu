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
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext.jsx';

function App() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 font-poppins dark:bg-gray-900">
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
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  );
}

export default AppWrapper;
