import { useState } from 'react';

export const useBookingModal = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [skipServiceSelection, setSkipServiceSelection] = useState(false);

  const openBookingModal = (skipSelection: boolean = false) => {
    setSkipServiceSelection(skipSelection);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSkipServiceSelection(false);
  };

  return {
    isBookingModalOpen,
    skipServiceSelection,
    openBookingModal,
    closeBookingModal,
  };
};