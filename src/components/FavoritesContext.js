import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const localData = localStorage.getItem('favorites');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (article) => {
        const isFavorite = favorites.some((fav) => fav.title === article.title);
        if (isFavorite) {
            setFavorites(favorites.filter((fav) => fav.title !== article.title));
        } else {
            setFavorites([...favorites, article]);
        }
    };

    const isFavorite = (article) => favorites.some((fav) => fav.title === article.title);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
