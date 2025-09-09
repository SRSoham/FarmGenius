import { Card } from "@/components/ui/card";
import { translations } from "@/lib/translations";

interface WhatsAppAlertsProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  time: string;
  emoji?: string;
}

export function WhatsAppAlerts({ language }: WhatsAppAlertsProps) {
  const t = translations[language];

  const messages: Message[] = [
    {
      id: '1',
      type: 'bot',
      content: t.heavyRainMessage,
      time: '2:30 PM',
      emoji: '🌧️'
    },
    {
      id: '2',
      type: 'bot',
      content: t.marketUpdateMessage,
      time: '11:15 AM',
      emoji: '📊'
    },
    {
      id: '3',
      type: 'user',
      content: t.thankYouMessage,
      time: '11:16 AM',
      emoji: '🙏'
    },
  ];

  const alertSettings = [
    { key: 'weatherAlerts', enabled: true },
    { key: 'marketUpdates', enabled: true },
    { key: 'farmingTips', enabled: true },
  ];

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center" data-testid="whatsapp-alerts-title">
        <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
        </svg>
        <span>{t.whatsappAlerts}</span>
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">{t.active}</span>
      </h2>
      
      <Card className="rounded-2xl shadow-lg border border-border overflow-hidden">
        {/* WhatsApp Header */}
        <div className="bg-green-500 text-white p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">{t.keralaFarmersBot}</h3>
              <p className="text-xs opacity-90" data-testid="bot-status">{t.onlineAutomated}</p>
            </div>
          </div>
        </div>
        
        {/* Recent Messages */}
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto" data-testid="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'items-start space-x-2'}`}>
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
              )}
              <div className={`rounded-2xl p-3 max-w-xs ${
                message.type === 'bot' 
                  ? 'bg-gray-100 text-gray-800 rounded-tl-md' 
                  : 'bg-green-500 text-white rounded-tr-md'
              }`}>
                <p className="text-sm" data-testid={`message-${message.id}`}>
                  {message.emoji} {message.content}
                </p>
                <p className={`text-xs mt-1 ${message.type === 'bot' ? 'text-gray-500' : 'opacity-75'}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Alert Settings */}
        <div className="border-t border-border p-4 bg-muted">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{t.alertSettings}</span>
            <button className="text-primary hover:text-primary/80">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {alertSettings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t[setting.key as keyof typeof t]}
                </span>
                <span className="text-green-600 font-medium" data-testid={`setting-${setting.key}`}>
                  ✓ {t.enabled}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
