"use client";

import { useState } from 'react';
import RoleSelector from '../components/RoleSelector';
import TrainerDashboard from '../components/Dashboard/TrainerDashboard';
import LearnerDashboard from '../components/Dashboard/LearnerDashboard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Show role selector if no user is selected
  if (!user) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  // Show appropriate dashboard based on user role
  return (
    <main>
      {user.role === 'TRAINER' || user.role === 'ADMIN' ? (
        <TrainerDashboard user={user} onLogout={handleLogout} />
      ) : (
        <LearnerDashboard user={user} onLogout={handleLogout} />
      )}
    </main>
  );
}