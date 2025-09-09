import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useSpeech } from "@/hooks/use-speech";
import { translations } from "@/lib/translations";

interface VoiceAssistantProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
}

export function VoiceAssistant({ language }: VoiceAssistantProps) {
  const [response, setResponse] = useState<string>('');
  const { isListening, startListening, stopListening, speak } = useSpeech(language);
  
  const t = translations[language];

  const handleVoiceQuery = async (query: string) => {
    try {
      const response = await fetch('/api/voice-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          userId: null,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResponse(data.response);
        speak(data.response);
        
        // Hide response after 5 seconds
        setTimeout(() => setResponse(''), 5000);
      }
    } catch (error) {
      console.error('Voice query failed:', error);
      setResponse(t.voiceError);
    }
  };

  const handleMicClick = () => {
    if (!isListening) {
      startListening((query: string) => {
        handleVoiceQuery(query);
      });
    } else {
      stopListening();
    }
  };

  return (
    <section className="py-6">
      <Card className="rounded-3xl shadow-xl border border-border p-6 text-center">
        <div className="mb-4">
          <div 
            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 cursor-pointer transition-transform hover:scale-105 touch-target ${
              isListening ? 'voice-assistant-listening' : 'voice-assistant-btn'
            }`}
            onClick={handleMicClick}
            data-testid="voice-assistant-button"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-foreground mb-2" data-testid="voice-prompt">
            {t.voicePrompt}
          </p>
          <p className="text-sm text-muted-foreground" data-testid="voice-help">
            {t.voiceHelp}
          </p>
        </div>
        
        {/* Voice Waveform */}
        {isListening && (
          <div className="voice-wave-container mb-4" data-testid="voice-waveform">
            <div className="voice-wave">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="wave-bar"></div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{t.listening}</p>
          </div>
        )}
        
        {/* Voice Response */}
        {response && (
          <div className="bg-muted rounded-xl p-4 text-left" data-testid="voice-response">
            <p className="text-sm text-muted-foreground mb-1">{t.aiAssistant}:</p>
            <p className="text-foreground">{response}</p>
          </div>
        )}
      </Card>
    </section>
  );
}
