import type { WeatherData, InsertWeatherData } from "@shared/schema";

interface OpenWeatherMapResponse {
  weather: Array<{
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
  name: string;
}

interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || 
                  process.env.OPENWEATHERMAP_API_KEY || 
                  'demo_key';
  }

  async getCurrentWeather(location: string): Promise<WeatherData | null> {
    try {
      const url = `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Weather API key is invalid or missing');
          return this.getFallbackWeatherData(location);
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenWeatherMapResponse = await response.json();
      
      return this.transformWeatherData(data, location);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getFallbackWeatherData(location);
    }
  }

  async getCurrentWeatherByCoords(coords: GeolocationCoords): Promise<WeatherData | null> {
    try {
      const { latitude, longitude } = coords;
      const url = `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Weather API key is invalid or missing');
          return this.getFallbackWeatherData(`${latitude},${longitude}`);
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenWeatherMapResponse = await response.json();
      
      return this.transformWeatherData(data, data.name || 'Current Location');
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      return this.getFallbackWeatherData('Current Location');
    }
  }

  async getWeatherForecast(location: string, days: number = 5): Promise<WeatherData[]> {
    try {
      const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`; // 8 forecasts per day (3-hour intervals)
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Weather API key is invalid or missing');
          return [];
        }
        throw new Error(`Weather forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Group forecasts by day and return daily summaries
      return this.processForecastData(data, location);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return [];
    }
  }

  private transformWeatherData(apiData: OpenWeatherMapResponse, location: string): WeatherData {
    const weatherCondition = this.getWeatherCondition(apiData.weather[0]?.main || 'Clear');
    
    return {
      id: `weather_${Date.now()}`,
      location,
      temperature: Math.round(apiData.main.temp),
      humidity: apiData.main.humidity,
      windSpeed: Math.round(apiData.wind.speed * 3.6), // Convert m/s to km/h
      visibility: apiData.visibility ? Math.round(apiData.visibility / 1000) : 10, // Convert m to km
      condition: weatherCondition,
      timestamp: new Date(),
    };
  }

  private getWeatherCondition(condition: string): string {
    const conditionMap: Record<string, string> = {
      'Clear': 'Clear Sky',
      'Clouds': 'Partly Cloudy',
      'Rain': 'Rainy',
      'Drizzle': 'Light Rain',
      'Thunderstorm': 'Thunderstorm',
      'Snow': 'Snowy',
      'Mist': 'Misty',
      'Fog': 'Foggy',
      'Haze': 'Hazy',
    };

    return conditionMap[condition] || 'Partly Cloudy';
  }

  private getFallbackWeatherData(location: string): WeatherData {
    // Return realistic weather data for Kerala region
    const keralWeatherVariations = [
      { temp: 28, humidity: 75, wind: 12, condition: 'Partly Cloudy' },
      { temp: 30, humidity: 80, wind: 8, condition: 'Sunny' },
      { temp: 26, humidity: 85, wind: 15, condition: 'Rainy' },
      { temp: 29, humidity: 78, wind: 10, condition: 'Clear Sky' },
    ];

    const randomVariation = keralWeatherVariations[Math.floor(Math.random() * keralWeatherVariations.length)];

    return {
      id: `fallback_weather_${Date.now()}`,
      location,
      temperature: randomVariation.temp,
      humidity: randomVariation.humidity,
      windSpeed: randomVariation.wind,
      visibility: 10,
      condition: randomVariation.condition,
      timestamp: new Date(),
    };
  }

  private processForecastData(forecastData: any, location: string): WeatherData[] {
    if (!forecastData.list || !Array.isArray(forecastData.list)) {
      return [];
    }

    // Group by day and get daily averages
    const dailyForecasts: WeatherData[] = [];
    const groupedByDate: Record<string, any[]> = {};

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
    });

    Object.entries(groupedByDate).forEach(([date, items]) => {
      const avgTemp = items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;
      const avgHumidity = items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length;
      const avgWindSpeed = items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length;
      
      // Get the most common weather condition for the day
      const conditions = items.map(item => item.weather[0]?.main);
      const mostCommonCondition = conditions.sort((a, b) =>
        conditions.filter(v => v === a).length - conditions.filter(v => v === b).length
      ).pop();

      dailyForecasts.push({
        id: `forecast_${Date.now()}_${date}`,
        location,
        temperature: Math.round(avgTemp),
        humidity: Math.round(avgHumidity),
        windSpeed: Math.round(avgWindSpeed * 3.6), // Convert m/s to km/h
        visibility: 10,
        condition: this.getWeatherCondition(mostCommonCondition || 'Clear'),
        timestamp: new Date(date),
      });
    });

    return dailyForecasts.slice(0, 5); // Return max 5 days
  }

  async saveWeatherData(weatherData: InsertWeatherData): Promise<WeatherData | null> {
    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save weather data: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving weather data:', error);
      return null;
    }
  }

  isApiKeyConfigured(): boolean {
    return this.apiKey !== 'demo_key' && this.apiKey.length > 0;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/weather?q=London&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const weatherService = new WeatherService();

// Kerala-specific weather utilities
export const keralaWeatherUtils = {
  getSeasonalRecommendations(month: number): string[] {
    const recommendations: Record<number, string[]> = {
      1: ['Harvest rabi crops', 'Prepare for summer cultivation', 'Check irrigation systems'],
      2: ['Summer crop planting', 'Water management crucial', 'Pest monitoring for coconut'],
      3: ['Pre-monsoon preparations', 'Drain maintenance', 'Fertilizer application'],
      4: ['Summer vegetables', 'Drip irrigation setup', 'Heat stress management'],
      5: ['Pre-monsoon planting', 'Monsoon crop preparation', 'Drainage system check'],
      6: ['Monsoon planting begins', 'Kharif crops sowing', 'Pest and disease watch'],
      7: ['Peak monsoon farming', 'Rice transplanting', 'Water logging prevention'],
      8: ['Monsoon crops care', 'Weed management', 'Nutritional spray'],
      9: ['Post-monsoon planting', 'Second crop rice', 'Soil health check'],
      10: ['Winter crop preparation', 'Harvest summer crops', 'Market price monitoring'],
      11: ['Winter vegetables', 'Rabi crop sowing', 'Pest control measures'],
      12: ['Year-end harvest', 'Crop residue management', 'Next year planning'],
    };

    return recommendations[month] || ['Regular farm monitoring', 'Crop care activities'];
  },

  getWeatherBasedAlerts(temperature: number, humidity: number, condition: string): string[] {
    const alerts: string[] = [];

    if (temperature > 35) {
      alerts.push('High temperature alert: Provide shade for sensitive crops');
    }

    if (humidity > 90) {
      alerts.push('High humidity: Monitor for fungal diseases');
    }

    if (condition.toLowerCase().includes('rain')) {
      alerts.push('Rain expected: Ensure proper drainage');
    }

    if (temperature < 20) {
      alerts.push('Cool weather: Protect sensitive plants');
    }

    return alerts;
  },

  getMonsoonPhase(month: number): 'pre-monsoon' | 'southwest-monsoon' | 'northeast-monsoon' | 'winter' {
    if (month >= 3 && month <= 5) return 'pre-monsoon';
    if (month >= 6 && month <= 9) return 'southwest-monsoon';
    if (month >= 10 && month <= 12) return 'northeast-monsoon';
    return 'winter';
  },
};
