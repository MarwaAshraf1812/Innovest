import React from 'react';
import MessagesPage from '../../../pages/MessagesPage';

export default function MessagesView({
  currentUser,
  initialContact,
  clearInitialContact,
  onViewProfile,
}) {
  return (
    <MessagesPage
      initialContact={initialContact}
      clearInitialContact={clearInitialContact}
      onViewProfile={onViewProfile}
    />
  );
}
