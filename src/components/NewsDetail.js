import React from 'react';
import { useLocation } from 'react-router-dom';

const NewsDetail = () => {
    const location = useLocation();
    const { title, description, imageUrl, newsUrl, author, date, source, content } = location.state;

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '12rem',
        padding: '0 1rem',
    };

    const cardStyle = {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
    };

    const imageStyle = {
        width: '40%',
        height: 'auto',
        borderRight: '1px solid #ddd',
    };

    const cardBodyStyle = {
        padding: '1.5rem',
        flex: 1,
    };

    const cardTitleStyle = {
        fontSize: '1.5rem',
        marginBottom: '1rem',
    };

    const cardTextStyle = {
        marginBottom: '1rem',
    };

    const cardTextSmallStyle = {
        display: 'block',
        marginBottom: '0.5rem',
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        border: 'none',
        padding: '0.5rem 1rem',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    };

    const buttonHoverStyle = {
        backgroundColor: '#0056b3',
    };

    const handleMouseEnter = (e) => {
        Object.assign(e.target.style, buttonHoverStyle);
    };

    const handleMouseLeave = (e) => {
        Object.assign(e.target.style, buttonStyle);
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <img
                    src={imageUrl || 'https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg'}
                    alt={title}
                    style={imageStyle}
                />
                <div style={cardBodyStyle}>
                    <h5 style={cardTitleStyle}>{title}</h5>
                    <p style={cardTextStyle}>{description}</p>
                    <p style={cardTextStyle}>{content}</p>
                    <p style={cardTextStyle}>
                        <small style={cardTextSmallStyle}>By {author || 'Unknown'} on {new Date(date).toGMTString()}</small>
                    </p>
                    <p style={cardTextStyle}>Source: {source} </p>
                    <a
                        href={newsUrl}
                        style={buttonStyle}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        Read Full Article
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
