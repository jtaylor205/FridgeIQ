import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FridgeProvider } from './context/FridgeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FridgePage from './pages/FridgePage';
import ScannerPage from './pages/ScannerPage';
import ExpirationPage from './pages/ExpirationPage';
import MealPlannerPage from './pages/MealPlannerPage';
import GroceryImportPage from './pages/GroceryImportPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <FridgeProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/fridge" element={<FridgePage />} />
                <Route path="/scan" element={<ScannerPage />} />
                <Route path="/expiration" element={<ExpirationPage />} />
                <Route path="/meals" element={<MealPlannerPage />} />
                <Route path="/import" element={<GroceryImportPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route path="/" element={<Navigate to="/fridge" replace />} />
              <Route path="*" element={<Navigate to="/fridge" replace />} />
            </Routes>
          </main>
        </div>
      </FridgeProvider>
    </AuthProvider>
  );
}
