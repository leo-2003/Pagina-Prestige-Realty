import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createClient, Session, User } from '@supabase/supabase-js';

// --- Supabase Client Initialization ---
// This is placed here to satisfy the project's "no new files" constraint.
// In a larger project, this would typically be in its own file (e.g., lib/supabaseClient.ts).

const supabaseUrl = 'https://mtyixobxgdnrzbenzvwq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10eWl4b2J4Z2RucnpiZW56dndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ0OTgsImV4cCI6MjA3NTA5MDQ5OH0.gf9S3UNRaMemfhjO21og9khWrTYYDfVpvJTNanm5dNw';

// Export the client for use in other parts of the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// --- End Supabase Client Initialization ---


interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error getting session:", error);
        } else {
            setSession(session);
            setUser(session?.user ?? null);
        }
        setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
    });

    return () => {
        subscription?.unsubscribe();
    };
  }, []);


  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = useMemo(() => ({
    user,
    session,
    loading,
    login,
    logout,
  }), [user, session, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};