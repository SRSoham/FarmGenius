import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { translations } from "@/lib/translations";
import type { MarketPrice } from "@shared/schema";

interface MarketPricesProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  location: string;
}

export function MarketPrices({ language, location }: MarketPricesProps) {
  const t = translations[language];

  const { data: marketPrices = [], isLoading } = useQuery<MarketPrice[]>({
    queryKey: ['/api/market-prices', location],
    queryFn: async () => {
      const response = await fetch(`/api/market-prices?location=${encodeURIComponent(location)}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const getPriceColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getPriceIcon = (change: number) => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '➡️';
  };

  return (
    <section className="py-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground" data-testid="market-prices-title">
          Market & Financial Support 💰
        </h2>
      </div>

      {/* Market Prices Overview */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Market Prices</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <div className="h-4 bg-muted rounded w-20 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded w-16 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : marketPrices.length > 0 ? (
          <div className="space-y-3">
            {marketPrices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {price.cropName}
                    {price.variety && <span className="text-sm text-muted-foreground ml-1">({price.variety})</span>}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {price.marketLocation} • {price.quality || 'Standard'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-foreground">
                      ₹{price.priceAverage.toLocaleString()}/{price.unit}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getPriceIcon(0)} 0%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Range: ₹{price.priceMin} - ₹{price.priceMax}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="space-y-4">
              {/* Sample Market Data */}
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-semibold text-foreground">Rice (IR-64)</h4>
                  <p className="text-sm text-muted-foreground">Ernakulam Market • Grade A</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-foreground">₹2,850/quintal</span>
                    <Badge variant="outline" className="text-xs text-green-600">
                      ↗️ +2.5%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Range: ₹2,800 - ₹2,900</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-semibold text-foreground">Coconut</h4>
                  <p className="text-sm text-muted-foreground">Thrissur Market • Fresh</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-foreground">₹25/piece</span>
                    <Badge variant="outline" className="text-xs text-red-600">
                      ↘️ -1.2%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Range: ₹23 - ₹27</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-semibold text-foreground">Black Pepper</h4>
                  <p className="text-sm text-muted-foreground">Kochi Spice Market • Export Quality</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-foreground">₹450/kg</span>
                    <Badge variant="outline" className="text-xs text-green-600">
                      ↗️ +5.8%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Range: ₹430 - ₹470</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Financial Tools */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Financial Tools</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Expense Tracker</p>
            <p className="text-xs text-muted-foreground">Track farm expenses</p>
          </div>

          <div className="p-4 border border-border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Profit Calculator</p>
            <p className="text-xs text-muted-foreground">Calculate crop profits</p>
          </div>

          <div className="p-4 border border-border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Loan Calculator</p>
            <p className="text-xs text-muted-foreground">Agricultural loans</p>
          </div>

          <div className="p-4 border border-border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Budget Planner</p>
            <p className="text-xs text-muted-foreground">Plan season budget</p>
          </div>
        </div>
      </Card>
    </section>
  );
}