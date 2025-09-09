import { useState, useEffect } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { VoiceAssistant } from "@/components/voice-assistant";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { QuickActions } from "@/components/quick-actions";
import { SoilAnalysis } from "@/components/soil-analysis";
import { WhatsAppAlerts } from "@/components/whatsapp-alerts";
import { RecentActivity } from "@/components/recent-activity";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useLocation } from "@/hooks/use-location";
import { translations } from "@/lib/translations";

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'ml' | 'ta' | 'hi'>('en');
  const { location, loading: locationLoading } = useLocation();
  
  const t = translations[language];

  useEffect(() => {
    // Apply Malayalam font class when Malayalam is selected
    if (language === 'ml') {
      document.body.classList.add('font-malayalam');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-malayalam');
    }
  }, [language]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card shadow-lg border-b-4 border-primary sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold text-foreground" data-testid="app-title">
              {t.appTitle}
            </h1>
          </div>
          
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>
        
        {/* Location Status */}
        <div className="bg-primary text-primary-foreground px-4 py-2">
          <div className="max-w-md mx-auto flex items-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-accent animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span data-testid="location-text">
              {locationLoading ? t.loadingLocation : location || "Ernakulam, Kerala"}
            </span>
            <span className="text-xs bg-green-500 px-2 py-1 rounded" data-testid="gps-status">
              {locationLoading ? t.loadingGPS : t.gpsActive}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-20">
        <VoiceAssistant language={language} />
        <WeatherDashboard language={language} location={location || "Ernakulam"} />
        <QuickActions language={language} />
        <SoilAnalysis language={language} location={location || "Ernakulam"} />
        <WhatsAppAlerts language={language} />
        <RecentActivity language={language} />
      </main>

      <BottomNavigation language={language} />
    </div>
  );
}
