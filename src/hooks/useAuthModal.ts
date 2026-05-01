import { useState } from 'react';

export const useAuthModal = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };
};