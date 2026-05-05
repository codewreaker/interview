/**
 * Interview Question: React Technical Interview - Data Fetching
 * 
 * Objective:
 * Create a component that fetches data from an API and displays it with loading and error states.
 * This tests your understanding of:
 * - useEffect for side effects
 * - Handling async operations
 * - Loading and error states
 * - Data fetching best practices
 * - TypeScript types
 * - Cleanup and memory leak prevention
 * 
 * Requirements:
 * - Fetch user data from an API endpoint
 * - Display loading state while fetching
 * - Display error message if fetch fails
 * - Display user data once loaded
 * - Handle component unmounting during fetch
 * - Implement retry functionality
 * - Support pagination or filtering (bonus)
 * 
 * Example API response:
 * {
 *   id: 1,
 *   name: "John Doe",
 *   email: "john@example.com",
 *   company: { name: "Tech Corp" }
 * }
 */

import React, { useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

export const UserDataFetcher: React.FC<{ userId?: number }> = ({ userId = 1 }) => {
  // TODO: Implement the component
  
  /*
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    fetchUser().catch(err => {
      if (isMounted) {
        setError("Failed to fetch user data");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userId, fetchUser]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={handleRetry}>Retry (Attempt {retryCount + 1})</button>
      </div>
    );
  }

  if (!user) {
    return <div className="empty">No user data available</div>;
  }

  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Company: {user.company.name}</p>
    </div>
  );
  */

  return <div>User data fetcher placeholder</div>;
};

export default UserDataFetcher;
