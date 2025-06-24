/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import supabase from "../supabase";
interface IAuthContext {
  loading : boolean
}
const AuthContext = createContext<IAuthContext | null>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuthStore();
  const [loading , setLoading] = useState(true)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false)
    })

    // الاشتراك في تغييرات تسجيل الدخول / الخروج
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return <AuthContext.Provider value={{ loading}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

