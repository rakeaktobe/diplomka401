"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CityContextType {
  city: string;
  setCity: (city: string) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ 
  children, 
  defaultCity 
}: { 
  children: React.ReactNode; 
  defaultCity: string;
}) {
  const [city, setCity] = useState(defaultCity);

  // Sync with localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const savedCity = localStorage.getItem("selected-city");
    if (savedCity && savedCity !== defaultCity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCity(savedCity);
    }
  }, [defaultCity]);

  const handleSetCity = (newCity: string) => {
    setCity(newCity);
    localStorage.setItem("selected-city", newCity);
  };

  return (
    <CityContext.Provider value={{ city, setCity: handleSetCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
