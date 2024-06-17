import React from 'react';
import { useFavorites } from './FavoritesContext';
import NewsItem from './NewsItem';

const Favorites = () => {
    const { favorites } = useFavorites();

    return (
        <div className="container">
            <h1 className="text-center my-3">Favorites</h1>
            <div className="row">
                {favorites.map((article, index) => (
                    <div className="col-md-4" key={index}>
                        <NewsItem
                            title={article.title}
                            description={article.description}
                            imageUrl={article.imageUrl}
                            newsUrl={article.newsUrl}
                            author={article.author}
                            date={article.date}
                            source={article.source}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
