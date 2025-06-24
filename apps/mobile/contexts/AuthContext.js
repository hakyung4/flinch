import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(undefined); // undefined: not loaded, null: no profile
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(undefined);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        setProfile(data ?? null);
        setProfileLoading(false);
      });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}