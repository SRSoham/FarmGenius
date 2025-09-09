import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { translations } from "@/lib/translations";
import type { WeatherData, Alert } from "@shared/schema";

interface WeatherDashboardProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  location: string;
}

export function WeatherDashboard({ language, location }: WeatherDashboardProps) {
  const t = translations[language];
  
  const { data: weatherData, isLoading: weatherLoading } = useQuery<WeatherData>({
    queryKey: ['/api/weather', location],
  });

  const { data: alerts = [], isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  if (weatherLoading || alertsLoading) {
    return (
      <section className="mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-48"></div>
          <div className="h-32 bg-muted rounded-2xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center" data-testid="weather-title">
        <svg className="w-6 h-6 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
        <span>{t.weatherTitle}</span>
      </h2>
      
      {/* Current Weather */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{t.todayWeather}</h3>
            <p className="text-sm opacity-90" data-testid="weather-location">
              {weatherData?.location || location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" data-testid="weather-temperature">
              {weatherData?.temperature || 28}°C
            </div>
            <div className="text-sm opacity-90" data-testid="weather-condition">
              {weatherData?.condition || t.partlyCloudy}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <svg className="w-5 h-5 text-blue-200 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">{t.humidity}</div>
            <div className="font-semibold" data-testid="weather-humidity">
              {weatherData?.humidity || 75}%
            </div>
          </div>
          <div>
            <svg className="w-5 h-5 text-blue-200 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a3 3 0 003 3h2a3 3 0 003-3V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">{t.wind}</div>
            <div className="font-semibold" data-testid="weather-wind">
              {weatherData?.windSpeed || 12} km/h
            </div>
          </div>
          <div>
            <svg className="w-5 h-5 text-blue-200 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">{t.visibility}</div>
            <div className="font-semibold" data-testid="weather-visibility">
              {weatherData?.visibility || 10} km
            </div>
          </div>
        </div>
      </div>
      
      {/* Weather Alerts */}
      {alerts.length > 0 && alerts.map((alert) => (
        <div key={alert.id} className="bg-destructive text-destructive-foreground rounded-xl p-4 mb-4 animate-blink" data-testid="weather-alert">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold mb-1" data-testid="alert-title">{alert.title}</h4>
              <p className="text-sm opacity-90" data-testid="alert-message">{alert.message}</p>
              <p className="text-xs mt-2 opacity-75">
                {t.issued}: {new Date(alert.timestamp).toLocaleString(language === 'en' ? 'en-US' : language === 'ml' ? 'ml-IN' : language === 'ta' ? 'ta-IN' : 'hi-IN')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
