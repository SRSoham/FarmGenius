import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { translations } from "@/lib/translations";
import type { VoiceQuery } from "@shared/schema";

interface RecentActivityProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
}

interface ActivityItem {
  id: string;
  type: 'weather' | 'voice' | 'market';
  title: string;
  description: string;
  time: string;
  icon: JSX.Element;
  bgColor: string;
  iconColor: string;
}

export function RecentActivity({ language }: RecentActivityProps) {
  const t = translations[language];

  const { data: voiceQueries = [] } = useQuery<VoiceQuery[]>({
    queryKey: ['/api/voice-queries/recent'],
  });

  const getActivityItems = (): ActivityItem[] => {
    const staticActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'weather',
        title: t.weatherAlertSent,
        description: t.heavyRainWarning,
        time: t.hoursAgo.replace('{hours}', '2'),
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        ),
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        id: '3',
        type: 'market',
        title: t.marketPriceCheck,
        description: t.checkedRicePrices,
        time: t.yesterday + ', 11:15 AM',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        ),
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600'
      }
    ];

    // Add recent voice queries
    const voiceActivities: ActivityItem[] = voiceQueries.slice(0, 2).map((query, index) => ({
      id: `voice-${query.id}`,
      type: 'voice' as const,
      title: t.voiceQuery,
      description: query.query,
      time: new Date(query.timestamp).toLocaleString(language === 'en' ? 'en-US' : language === 'ml' ? 'ml-IN' : language === 'ta' ? 'ta-IN' : 'hi-IN'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }));

    return [...voiceActivities, ...staticActivities].slice(0, 3);
  };

  const activities = getActivityItems();

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center" data-testid="recent-activity-title">
        <svg className="w-6 h-6 text-muted-foreground mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>{t.recentActivity}</span>
      </h2>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="rounded-xl border border-border p-4 flex items-start space-x-3">
            <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
              <div className={activity.iconColor}>
                {activity.icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground" data-testid={`activity-title-${activity.id}`}>
                {activity.title}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`activity-desc-${activity.id}`}>
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1" data-testid={`activity-time-${activity.id}`}>
                {activity.time}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
