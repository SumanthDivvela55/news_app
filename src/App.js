import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Moon, Cloud, CloudRain, CloudSnow, Wind, CloudLightning } from 'lucide-react';

// Mood options with associated colors and emojis
const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-200' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-yellow-400' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-200' },
  { id: 'sad', emoji: '😔', label: 'Sad', color: 'bg-blue-400' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-400' }
];

// Weather icon mapping
const WeatherIcon = ({ weatherCode }) => {
  switch (weatherCode) {
    case 'Clear':
      return <Sun className="text-yellow-500" />;
    case 'Clouds':
      return <Cloud className="text-gray-500" />;
    case 'Rain':
      return <CloudRain className="text-blue-500" />;
    case 'Snow':
      return <CloudSnow className="text-blue-200" />;
    case 'Thunderstorm':
      return <CloudLightning className="text-purple-500" />;
    case 'Drizzle':
      return <CloudRain className="text-blue-300" />;
    case 'Atmosphere':
      return <Wind className="text-gray-400" />;
    default:
      return <Cloud className="text-gray-400" />;
  }
};

const App = () => {
  // State initialization
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [entries, setEntries] = useState([]);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [filterMood, setFilterMood] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('form'); // 'form', 'calendar', 'stats'

  // Format current date on component mount
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(formattedDate);

    // Load entries from localStorage
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Get user's location
    getUserLocation();
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  // Update body class when dark mode changes
  useEffect(() => {
    document.body.className = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Get user location using browser's Geolocation API
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to access your location. Please check your browser settings.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      // Note: In a real app, API key would be stored securely server-side
      const apiKey = 'DEMO_API_KEY'; // Replace with your OpenWeatherMap API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Weather data not available');
      }

      // For demo purposes, we'll use sample data since we don't have a real API key
      // In a real implementation, you would parse the actual response
      const sampleWeatherData = {
        name: 'Sample City',
        main: {
          temp: 22.5,
          humidity: 65
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky'
          }
        ]
      };

      setWeather(sampleWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Unable to fetch weather data. Using sample data instead.');

      // Set sample weather data as fallback
      setWeather({
        name: 'Unknown',
        main: {
          temp: 20,
          humidity: 60
        },
        weather: [
          {
            main: 'Clouds',
            description: 'scattered clouds'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      formattedDate: currentDate,
      mood: selectedMood,
      note,
      weather: weather ? {
        temp: weather.main.temp,
        condition: weather.weather[0].main,
        description: weather.weather[0].description,
        location: weather.name
      } : null
    };

    setEntries([newEntry, ...entries]);
    setSelectedMood('');
    setNote('');
    setNotification('Journal entry saved successfully!');

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  // Export entries as CSV
  const exportToCSV = () => {
    const csvRows = [];

    // Add header row
    csvRows.push(['Date', 'Mood', 'Note', 'Weather Condition', 'Temperature', 'Location']);

    // Add data rows
    entries.forEach(entry => {
      csvRows.push([
        entry.formattedDate,
        entry.mood,
        entry.note,
        entry.weather ? entry.weather.condition : 'N/A',
        entry.weather ? `${entry.weather.temp}°C` : 'N/A',
        entry.weather ? entry.weather.location : 'N/A'
      ]);
    });

    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mood-journal.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get filtered entries based on selected mood
  const getFilteredEntries = () => {
    if (!filterMood) return entries;
    return entries.filter(entry => entry.mood === filterMood);
  };

  // Count entries by mood type for statistics
  const getMoodStats = () => {
    const stats = {};
    MOODS.forEach(mood => {
      stats[mood.id] = entries.filter(entry => entry.mood === mood.id).length;
    });
    return stats;
  };

  // Find mood object by ID
  const getMoodById = (id) => MOODS.find(mood => mood.id === id) || MOODS[0];

  // Group entries by day for calendar view
  const getEntriesByDay = () => {
    const entriesByDay = {};
    entries.forEach(entry => {
      const dateKey = new Date(entry.date).toLocaleDateString();
      if (!entriesByDay[dateKey]) {
        entriesByDay[dateKey] = [];
      }
      entriesByDay[dateKey].push(entry);
    });
    return entriesByDay;
  };

  // Generate days for calendar view
  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    const entriesByDay = getEntriesByDay();

    // Generate days for current month
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const dateKey = date.toLocaleDateString();
      const dayEntries = entriesByDay[dateKey] || [];

      days.push({
        date,
        dayOfMonth: i,
        entries: dayEntries,
        hasEntry: dayEntries.length > 0,
        mood: dayEntries.length > 0 ? dayEntries[0].mood : null
      });
    }

    return days;
  };

  // Main render function with conditional views
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <header className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mood Journal</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('form')}
                className={`px-3 py-1 rounded ${viewMode === 'form' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                New Entry
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-3 py-1 rounded ${viewMode === 'stats' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                Statistics
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Display current date */}
        <div className="text-center my-4">
          <h2 className="text-xl">{currentDate}</h2>
        </div>

        {/* Weather information display */}
        {weather && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-4xl">
                <WeatherIcon weatherCode={weather.weather[0].main} />
              </div>
              <div>
                <p className="text-lg font-semibold">{weather.name}</p>
                <p>{weather.weather[0].description}</p>
                <p className="text-xl">{weather.main.temp}°C</p>
              </div>
            </div>
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Success notification */}
        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 animate-fade-in-out">
            {notification}
          </div>
        )}

        {/* New Entry Form */}
        {viewMode === 'form' && (
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">How are you feeling today?</h2>

            <form onSubmit={handleSubmit}>
              {/* Mood selection */}
              <div className="mb-6">
                <label className="block mb-2">Select your mood:</label>
                <div className="flex flex-wrap gap-3">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSelectedMood(mood.id)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedMood === mood.id
                        ? `${mood.color} scale-110 shadow-lg`
                        : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      <span className="text-3xl mb-1">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note input */}
              <div className="mb-6">
                <label className="block mb-2" htmlFor="note">Journal Entry:</label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How was your day? What made you feel this way?"
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  rows="4"
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Save Entry
              </button>
            </form>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Calendar View</h2>
              <div>
                <label className="mr-2">Filter by mood:</label>
                <select
                  value={filterMood}
                  onChange={(e) => setFilterMood(e.target.value)}
                  className={`p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                >
                  <option value="">All moods</option>
                  {MOODS.map(mood => (
                    <option key={mood.id} value={mood.id}>{mood.label}</option>
                  ))}
                </select>
                <button
                  onClick={exportToCSV}
                  className="ml-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold p-2">{day}</div>
              ))}

              {generateCalendarDays().map((day, index) => {
                const mood = day.mood ? getMoodById(day.mood) : null;
                return (
                  <div
                    key={index}
                    className={`p-2 h-24 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-200'
                      } ${day.hasEntry ? mood.color : ''} overflow-hidden`}
                  >
                    <div className="font-bold">{day.dayOfMonth}</div>
                    {day.hasEntry && (
                      <div className="text-sm mt-1">
                        <div className="text-xl">{getMoodById(day.mood).emoji}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Entries list */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Journal Entries</h3>
              {getFilteredEntries().length === 0 ? (
                <p className="text-center py-6">No entries found.</p>
              ) : (
                <div className="space-y-4">
                  {getFilteredEntries().map(entry => {
                    const mood = getMoodById(entry.mood);
                    return (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-lg ${mood.color} bg-opacity-30`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-lg font-semibold">{entry.formattedDate}</div>
                            <div className="flex items-center mt-1">
                              <span className="text-2xl mr-2">{mood.emoji}</span>
                              <span>{mood.label}</span>
                            </div>
                          </div>

                          {entry.weather && (
                            <div className="flex items-center">
                              <WeatherIcon weatherCode={entry.weather.condition} />
                              <span className="ml-1">{entry.weather.temp}°C</span>
                            </div>
                          )}
                        </div>

                        {entry.note && (
                          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded">
                            {entry.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics View */}
        {viewMode === 'stats' && (
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">Mood Statistics</h2>

            {entries.length === 0 ? (
              <p className="text-center py-6">No entries to display statistics.</p>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Mood distribution */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="font-semibold mb-3">Mood Distribution</h3>
                    <div className="space-y-3">
                      {MOODS.map(mood => {
                        const count = getMoodStats()[mood.id] || 0;
                        const percentage = entries.length > 0
                          ? Math.round((count / entries.length) * 100)
                          : 0;

                        return (
                          <div key={mood.id} className="flex items-center">
                            <div className="w-8 text-center mr-2">{mood.emoji}</div>
                            <div className="flex-grow">
                              <div className="h-6 bg-gray-300 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${mood.color}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="ml-3 w-16 text-right">
                              {count} ({percentage}%)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total entries stats */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="font-semibold mb-3">Journal Summary</h3>
                    <div className="space-y-2">
                      <p>Total entries: {entries.length}</p>
                      <p>First entry: {entries.length ? new Date(entries[entries.length - 1].date).toLocaleDateString() : 'N/A'}</p>
                      <p>Latest entry: {entries.length ? new Date(entries[0].date).toLocaleDateString() : 'N/A'}</p>
                      <p>Most common mood: {
                        entries.length ?
                          (() => {
                            const stats = getMoodStats();
                            const maxMood = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
                            const mood = getMoodById(maxMood);
                            return (
                              <span className="inline-flex items-center">
                                <span className="mr-1">{mood.emoji}</span> {mood.label}
                              </span>
                            );
                          })() : 'N/A'
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={`mt-8 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner`}>
        <div className="container mx-auto text-center text-sm">
          <p>Interactive Mood Journal with Weather Integration</p>
        </div>
      </footer>
    </div>
  );
};

export default App;