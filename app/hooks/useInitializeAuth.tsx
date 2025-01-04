'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';

const useInitializeAuth = () => {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);
};

export default useInitializeAuth;
