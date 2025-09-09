import { Card } from "@/components/ui/card";
import { translations } from "@/lib/translations";

interface QuickActionsProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
}

const actions = [
  { 
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
    titleKey: 'cropGuidance',
    descKey: 'cropGuidanceDesc',
    color: 'text-primary',
    testId: 'action-crop-guidance'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
    titleKey: 'pestControl',
    descKey: 'pestControlDesc',
    color: 'text-secondary',
    testId: 'action-pest-control'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
    titleKey: 'marketPrices',
    descKey: 'marketPricesDesc',
    color: 'text-accent',
    testId: 'action-market-prices'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
    titleKey: 'farmCalendar',
    descKey: 'farmCalendarDesc',
    color: 'text-primary',
    testId: 'action-farm-calendar'
  },
];

export function QuickActions({ language }: QuickActionsProps) {
  const t = translations[language];

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center" data-testid="quick-actions-title">
        <svg className="w-6 h-6 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        <span>{t.quickActions}</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Card
            key={index}
            className="rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer touch-target"
            data-testid={action.testId}
          >
            <div className={`${action.color} text-2xl mb-2`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              {t[action.titleKey as keyof typeof t]}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t[action.descKey as keyof typeof t]}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
