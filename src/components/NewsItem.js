import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';

const NewsItem = (props) => {
  const { title, description, imageUrl, newsUrl, author, date, source, content } = props;
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate('/news-detail', { state: { title, description, imageUrl, newsUrl, author, date, source, content } });
  };

  return (
    <div className="my-3">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '0' }}>
          <span className="badge rounded-pill bg-danger">{source.name}</span>
        </div>
        <img src={imageUrl || 'https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg'} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text"><small className="text-muted">By {author || 'Unknown'} on {new Date(date).toGMTString()}</small></p>
          <button className="btn btn-sm btn-outline-primary mx-2" onClick={() => toggleFavorite(props)}>
            {isFavorite(props) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <button className="btn btn-sm btn-dark" onClick={handleReadMore}>Read More</button>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
