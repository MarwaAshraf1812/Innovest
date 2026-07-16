import React from 'react'
import CommunitiesPage from '../../community/pages/CommunitiesPage'

export default function CommunitiesView({ currentUser, onViewProfile }) {
  return <CommunitiesPage currentUser={currentUser} onViewProfile={onViewProfile} />
}
