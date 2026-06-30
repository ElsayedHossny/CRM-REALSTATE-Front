"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { IProperty } from "@/interfaces/property.interface";

interface FavoritesContextType {
  favoriteProperties: IProperty[];
  addToFavorites: (property: IProperty) => void;
  removeFromFavorites: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

const FAVORITES_STORAGE_KEY = "favorite-properties";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteProperties, setFavoriteProperties] = useState<IProperty[]>([]);

  /**
   * Load favorites from localStorage once
   * when the application starts.
   */
  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  /**
   * Read favorite properties from localStorage
   */
  const loadFavoritesFromStorage = (): void => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

      if (!storedFavorites) return;

      const parsedFavorites: IProperty[] = JSON.parse(storedFavorites);

      setFavoriteProperties(parsedFavorites);
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    }
  };

  const saveFavoritesToStorage = (favorites: IProperty[]): void => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  };

  /**
   * Check if property already exists
   */
  const isFavorite = (propertyId: string): boolean => {
    return favoriteProperties.some((property) => property._id === propertyId);
  };

  /**
   * Add property to favorites
   */
  const addToFavorites = (property: IProperty): void => {
    const propertyAlreadyExists = favoriteProperties.some(
      (favoriteProperty) => favoriteProperty._id === property._id,
    );

    if (propertyAlreadyExists) {
      return;
    }

    const updatedFavorites = [...favoriteProperties, property];

    setFavoriteProperties(updatedFavorites);

    saveFavoritesToStorage(updatedFavorites);
  };

  /**
   * Remove property from favorites
   */
  const removeFromFavorites = (propertyId: string): void => {
    const updatedFavorites = favoriteProperties.filter(
      (property) => property._id !== propertyId,
    );

    setFavoriteProperties(updatedFavorites);

    saveFavoritesToStorage(updatedFavorites);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteProperties,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
