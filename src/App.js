import React, { useState } from "react";
import axios from "axios";
import "./App.css";   // Import CSS

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const apiKey = "c70da672e2912abc8be6d8ff01292380";

  const getWeather = async (e) => {
    e.preventDefault();
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      // Current weather
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(res.data);

      // Forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const daily = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(daily);
    } catch (err) {
      setError("❌ City not found. Try again!");
    }
    setCity("");
  };

  // Weather → Icon
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return "☀️";
      case "Rain":
        return "🌧️";
      case "Clouds":
        return "☁️";
      case "Snow":
        return "❄️";
      case "Thunderstorm":
        return "⛈️";
      default:
        return "🌡️";
    }
  };

  // Weather → Background Class
  const getBackgroundClass = (condition) => {
    switch (condition) {
      case "Clear":
        return "sunny";
      case "Rain":
        return "rainy";
      case "Clouds":
        return "cloudy";
      case "Snow":
        return "snowy";
      case "Thunderstorm":
        return "stormy";
      default:
        return "default";
    }
  };

  return (
    <div className={`app ${weather ? getBackgroundClass(weather.weather[0].main) : "default"}`}>
      <h1>🌍 Weather Report Panel</h1>

      <form onSubmit={getWeather}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-card">
          <div className="icon">{getWeatherIcon(weather.weather[0].main)}</div>
          <h2>{weather.name}</h2>
          <p className="desc">{weather.weather[0].description}</p>

          <div className="weather-grid">
            <div>
              <span className="big">{weather.main.temp}°C</span>
              <span>Temperature</span>
            </div>
            <div>
              💧
              <span>{weather.main.humidity}%</span>
              <span>Humidity</span>
            </div>
            <div>
              🌬️
              <span>{weather.wind.speed} m/s</span>
              <span>Wind</span>
            </div>
            <div>
              🌡️
              <span>{weather.main.feels_like}°C</span>
              <span>Feels Like</span>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-container">
          <h3>📅 5-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.map((day, index) => (
              <div className="forecast-card" key={index}>
                <div className="icon">
                  {getWeatherIcon(day.weather[0].main)}
                </div>
                <span className="day">
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
                <span>{day.main.temp}°C</span>
                <span className="desc">{day.weather[0].description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
