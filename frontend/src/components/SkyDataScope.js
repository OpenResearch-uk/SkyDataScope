import React, { useState } from 'react';
import { Sun, Moon, Star, Search, MapPin, Database, LineChart, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CITIES = {
  'London': { lat: 51.5074, lon: -0.1278 },
  'Paris': { lat: 48.8566, lon: 2.3522 },
  'Moscow': { lat: 55.7558, lon: 37.6173 },
  'Prague': { lat: 50.0755, lon: 14.4378 },
  'Berlin': { lat: 52.5200, lon: 13.4050 },
  'Rome': { lat: 41.9028, lon: 12.4964 },
  'Madrid': { lat: 40.4168, lon: -3.7038 },
  'New York': { lat: 40.7128, lon: -74.0060 }
};

const API_URL = 'http://localhost:5000/api';

const Header = () => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div className="absolute -top-1 -right-1">
              <div className="h-3 w-3 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkyDataScope
            </h1>
            <p className="text-sm text-gray-600">Open Source Sky Research</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Observe</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Database className="h-5 w-5 text-purple-600" />
            <span>Data</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <LineChart className="h-5 w-5 text-indigo-600" />
            <span>Analysis</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Research</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
);

const ObjectCard = ({ object }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'star': return <Star className="h-5 w-5 text-yellow-400" />;
      case 'planet': return <Star className="h-5 w-5 text-blue-400" />;
      case 'moon': return <Moon className="h-5 w-5 text-gray-400" />;
      case 'sun': return <Sun className="h-5 w-5 text-orange-400" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2 mb-2">
        {getIcon(object.type)}
        <h3 className="font-medium">{object.name}</h3>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p>Constellation: {object.constellation}</p>
        <p>Altitude: {object.altitude.toFixed(1)}°</p>
        <p>Azimuth: {object.azimuth.toFixed(1)}°</p>
        {object.magnitude && (
          <p>Magnitude: {object.magnitude.toFixed(1)}</p>
        )}
        {object.phase && (
          <p>Phase: {object.phase.toFixed(0)}%</p>
        )}
      </div>
    </div>
  );
};

const LocationSearch = ({ onLocationSet }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    if (CITIES[searchTerm]) {
      onLocationSet(CITIES[searchTerm]);
      return;
    }

    const coords = searchTerm.split(',').map(n => parseFloat(n.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      if (coords[0] >= -90 && coords[0] <= 90 && coords[1] >= -180 && coords[1] <= 180) {
        onLocationSet({ lat: coords[0], lon: coords[1] });
      } else {
        setError('Invalid coordinates range');
      }
    } else {
      setError('Please enter a valid city or coordinates');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      const matches = Object.keys(CITIES).filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectCity = (city) => {
    setSearchTerm(city);
    setShowSuggestions(false);
    onLocationSet(CITIES[city]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-lg"
          placeholder="Enter city name or coordinates"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
        />
        <button 
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {suggestions.map(city => (
            <button
              key={city}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => selectCity(city)}
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const SkyDataScope = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocationSet = async (location) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_URL}/sky-objects?lat=${location.lat}&lon=${location.lon}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sky objects');
      }
      
      const data = await response.json();
      setObjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <LocationSearch onLocationSet={handleLocationSet} />
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading celestial objects...</p>
          </div>
        ) : objects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {objects.map((object, index) => (
              <ObjectCard key={index} object={object} />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default SkyDataScope;