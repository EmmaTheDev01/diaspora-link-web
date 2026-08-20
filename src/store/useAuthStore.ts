import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, UserRole, CorridorType } from '../types';
import { dbService } from '../services/db';
import { createClient } from '../lib/supabase/client';
import toast from 'react-hot-toast';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  detectedCorridor: CorridorType;
  currency: 'CAD' | 'RWF';
  isAuthModalOpen: boolean;

  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
  setCurrency: (curr: 'CAD' | 'RWF') => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => void;
  loginUser: (email: string, password?: string, role?: UserRole, taxId?: string) => Promise<UserProfile>;
  registerUser: (payload: { email: string; password?: string; full_name: string; role: UserRole; taxId?: string }) => Promise<UserProfile>;
  autoDetectRegion: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      activeRole: 'buyer',
      detectedCorridor: 'YYZ_KGL',
      currency: 'CAD',
      isAuthModalOpen: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          activeRole: user?.role || 'buyer',
        }),

      setRole: (role) => set({ activeRole: role }),

      setCurrency: (currency) => set({ currency }),

      openAuthModal: () => set({ isAuthModalOpen: true }),

      closeAuthModal: () => set({ isAuthModalOpen: false }),

      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (e) {
          // Ignore
        }
        set({
          user: null,
          isAuthenticated: false,
          activeRole: 'buyer',
        });
        toast.success('Signed out successfully.');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      loginUser: async (email, password, role, taxId) => {
        try {
          const user = await dbService.signInWithSupabase(email, password);
          set({
            user,
            isAuthenticated: true,
            activeRole: user.role,
            isAuthModalOpen: false,
          });

          toast.success(`Welcome back, ${user.full_name?.split(' ')[0]}!`);
          return user;
        } catch (e: any) {
          toast.error(e.message || 'Authentication error. Invalid email or password.');
          throw e;
        }
      },

      registerUser: async (payload) => {
        try {
          const user = await dbService.signUpWithSupabase(payload);
          set({
            user,
            isAuthenticated: true,
            activeRole: user.role,
            isAuthModalOpen: false,
          });

          toast.success(`Account registered successfully, ${user.full_name?.split(' ')[0]}!`);
          return user;
        } catch (e: any) {
          toast.error(e.message || 'Registration error. Please try again.');
          throw e;
        }
      },

      autoDetectRegion: () => {
        try {
          if (typeof window !== 'undefined') {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            if (tz.startsWith('Africa') || tz.startsWith('Asia') || tz.startsWith('Indian')) {
              set({ detectedCorridor: 'KGL_YYZ', currency: 'RWF' });
            }
          }
        } catch (e) {
          // Keep baseline default
        }
      },

      initAuth: async () => {
        try {
          const supabase = createClient();
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            const authUser = sessionData.session.user;
            const profile =
              (await dbService.fetchUserProfile(authUser.id)) ||
              (await dbService.fetchUserProfile(authUser.email || ''));

            if (profile) {
              set({ user: profile, isAuthenticated: true, activeRole: profile.role });
              return;
            }

            const realName =
              authUser.user_metadata?.full_name ||
              authUser.email?.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
              'User Account';

            const fallbackUser: UserProfile = {
              id: authUser.id,
              email: authUser.email || '',
              full_name: realName,
              phone_number: authUser.user_metadata?.phone_number || '',
              role: authUser.user_metadata?.role || 'buyer',
              country: 'RW',
              is_kyc_verified: true,
              is_approved: true,
              created_at: authUser.created_at,
            };
            set({ user: fallbackUser, isAuthenticated: true, activeRole: fallbackUser.role });
          } else {
            // Keep persisted user session upon F5/Reload
            const currentUser = get().user;
            if (currentUser) {
              set({ isAuthenticated: true, activeRole: currentUser.role });
            }
          }
        } catch (e) {
          console.warn('initAuth error:', e);
        }
      },
    }),
    {
      name: 'magic_link_auth_session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole,
        detectedCorridor: state.detectedCorridor,
        currency: state.currency,
      }),
    }
  )
);
