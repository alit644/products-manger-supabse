// AuthRoute.jsx
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext ';
import { useAuthStore } from '../store/useAuthStore';
import Loader from './ui/Loader';
interface ProtectedRouteProps {
  redirectIfAuthenticated?: boolean;
  children: React.ReactNode;
}
const ProtectedRoute = ({ children, redirectIfAuthenticated = false }:ProtectedRouteProps) => {
const authContext = useAuth();
  const loading = authContext ? authContext.loading : false;
  const {user} = useAuthStore()
  if (loading) return <Loader />
  // إذا كان المستخدم موجودًا ونريد منعه من دخول صفحة مثل login/register
  if (user && redirectIfAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // إذا لم يكن المستخدم موجودًا ونريد حمايته من صفحات خاصة
  if (!user && !redirectIfAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
