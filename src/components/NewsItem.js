import React from 'react';
import { useFavorites } from './FavoritesContext';

const NewsItem = (props) => {
  const { title, description, imageUrl, newsUrl, author, date, source } = props;
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="my-3">
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            right: '0'
          }}
        >
          <span className="badge rounded-pill bg-danger"> {source} </span>
         
        </div>
        <img
          src={!imageUrl ? 'https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg' : imageUrl}
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{title} </h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-muted">By {!author ? 'Unknown' : author} on {new Date(date).toGMTString()}</small>
          </p>
          <button
            className="btn btn-sm btn-outline-primary mx-2"
            onClick={() => toggleFavorite(props)}
          >
            {isFavorite(props) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-sm btn-dark">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
