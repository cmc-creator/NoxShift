import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { authAPI } from '../services/api';

interface NoxShiftUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  noxUser: NoxShiftUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [noxUser, setNoxUser] = useState<NoxShiftUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNoxUser = async () => {
    try {
      const token = localStorage.getItem('noxshift_token');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setNoxUser(response.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('noxshift_token');
      setNoxUser(null);
    }
  };

  useEffect(() => {
    try {
      // Check for NoxShift token on mount
      fetchNoxUser();

      // Also listen to Firebase auth changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      }, (error) => {
        console.error('Firebase auth error:', error);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    authAPI.logout();
    setNoxUser(null);
  };

  const refreshUser = async () => {
    await fetchNoxUser();
  };

  return (
    <AuthContext.Provider value={{ user, noxUser, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
