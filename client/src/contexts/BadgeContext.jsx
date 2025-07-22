import { createContext, useState, useEffect } from 'react';
import { fetchBadges } from '../services/badges';

// create a new context for monitoring badges
export const BadgeContext = createContext();

// make the badge provider just like with the auth context
export default function BadgeProvider({ children }) {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchBadges().then(res => setBadges(res.data.badges));
  }, []);

  // wrap the view of what is being rendered in the new badge context
  return (
    <BadgeContext.Provider value={{ badges }}>
      {children}
    </BadgeContext.Provider>
  );
}