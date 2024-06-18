import React, { useState } from 'react';
import NavBar from './components/Navbar';
import News from './components/News';
import { Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Favorites from './components/Favorites';
import NewsDetail from './components/NewsDetail';
import { FavoritesProvider } from './components/FavoritesContext';

const App = () => {
  const pageSize = 5;
  const apiKey = "41f4d656dd5b4edbbe3598ee682e1cfa"; 
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <FavoritesProvider>
        <NavBar />
        <LoadingBar height={3} color="#f11946" progress={progress} />

        <Routes>
          <Route path="/" element={<News apiKey={apiKey} setProgress={setProgress} key="general" pageSize={pageSize} country="in" category="general" />} />
          <Route path="/business" element={<News apiKey={apiKey} setProgress={setProgress} key="business" pageSize={pageSize} country="in" category="business" />} />
          <Route path="/entertainment" element={<News apiKey={apiKey} setProgress={setProgress} key="entertainment" pageSize={pageSize} country="in" category="entertainment" />} />
          <Route path="/general" element={<News apiKey={apiKey} setProgress={setProgress} key="general" pageSize={pageSize} country="in" category="general" />} />
          <Route path="/health" element={<News apiKey={apiKey} setProgress={setProgress} key="health" pageSize={pageSize} country="in" category="health" />} />
          <Route path="/science" element={<News apiKey={apiKey} setProgress={setProgress} key="science" pageSize={pageSize} country="in" category="science" />} />
          <Route path="/sports" element={<News apiKey={apiKey} setProgress={setProgress} key="sports" pageSize={pageSize} country="in" category="sports" />} />
          <Route path="/technology" element={<News apiKey={apiKey} setProgress={setProgress} key="technology" pageSize={pageSize} country="in" category="technology" />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/news-detail" element={<NewsDetail />} />
        </Routes>
      </FavoritesProvider>
    </div>
  );
};

export default App;
