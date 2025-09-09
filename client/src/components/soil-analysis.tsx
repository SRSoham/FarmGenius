import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { translations } from "@/lib/translations";
import type { SoilData } from "@shared/schema";

interface SoilAnalysisProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  location: string;
}

export function SoilAnalysis({ language, location }: SoilAnalysisProps) {
  const t = translations[language];

  const { data: soilData, isLoading } = useQuery<SoilData>({
    queryKey: ['/api/soil', location],
  });

  if (isLoading) {
    return (
      <section className="mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-40"></div>
          <div className="h-48 bg-muted rounded-2xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center" data-testid="soil-analysis-title">
        <svg className="w-6 h-6 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>{t.soilAnalysis}</span>
      </h2>
      
      <Card className="rounded-2xl shadow-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t.yourSoilType}</h3>
            <p className="text-sm text-muted-foreground">{t.basedOnGPS}</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground">{t.soilType}:</span>
            <span className="font-semibold text-primary" data-testid="soil-type">
              {soilData?.soilType || t.lateriticSoil}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground">{t.phLevel}:</span>
            <span className="font-semibold text-secondary" data-testid="soil-ph">
              {soilData?.phLevel || '6.2'} ({t.slightlyAcidic})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground">{t.fertility}:</span>
            <span className="font-semibold text-accent" data-testid="soil-fertility">
              {soilData?.fertility || t.moderate}
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-xl">
          <p className="text-sm text-foreground">
            <svg className="inline w-4 h-4 text-accent mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <strong>{t.recommendation}:</strong> {soilData?.recommendations || t.soilRecommendationDefault}
          </p>
        </div>
      </Card>
    </section>
  );
}
