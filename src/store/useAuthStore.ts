/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import supabase from "../supabase";
import { SignInData, SignUpData } from "../interfaces";
import toast from "react-hot-toast";
interface IAuthStore {
  user: any;
  isLoading: boolean;
  error: any;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  signUpWithGithub: () => Promise<void>;
  logout: () => void;
  setUser: (user: any) => void;
}
export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  signUp: async (data: SignUpData) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.userName,
          },
        },
      });

      if (error) {
        set({ isLoading: false, error: error });
        console.log("Error Singing Up", error?.message);
        toast.error(`Error Signing Up: ${error?.message}`, {
          duration: 2400,
          position: "top-left",
          style: {
            backgroundColor: "#27272a",
            color: "#fff",
            border: "1px dashed #27272a",
          },
        });
      } else {
        // await ensureProfileExists();
        set({ isLoading: false });
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      set({ isLoading: false, error: error });
    }
  },
  signIn: async (data: SignInData) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        set({ isLoading: false, error: error });
        console.log("Error Singing Up", error?.message);
        toast.error(`Error Signing Up: ${error?.message}`, {
          duration: 2400,
          position: "top-left",
          style: {
            backgroundColor: "#27272a",
            color: "#fff",
            border: "1px dashed #27272a",
          },
        });
      } else {
        // await ensureProfileExists();
        set({ isLoading: false });
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  },

  signUpWithGoogle: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://products-manger-supabse.vercel.app/",
        },
      });
      if (error) {
        console.log("Error signing up with Google:", error.message);
      } else {
        console.log(data);
        set({ isLoading: false });
      }
    } catch (error) {
      console.log(error);
      set({ isLoading: false, error: error });
    }
  },
  signUpWithGithub: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: "https://products-manger-supabse.vercel.app/",
        },
      });
      if (error) {
        console.log("Error signing up with Github:", error.message);
      } else {
        console.log(data);
        set({ isLoading: false });
      }
    } catch (error) {
      console.log(error);
      set({ isLoading: false, error: error });
    }
  },

  logout: () => {
    supabase.auth.signOut();
  },

  setUser: (user: any) => {
    set({ user, isLoading: false });
  },
}));
