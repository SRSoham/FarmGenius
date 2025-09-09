import { useState, useEffect, useCallback } from "react";

interface UseSpeechReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string) => void;
}

export function useSpeech(language: 'en' | 'ml' | 'ta' | 'hi'): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) &&
    'speechSynthesis' in window;

  const getLanguageCode = (lang: 'en' | 'ml' | 'ta' | 'hi'): string => {
    const langMap = {
      'en': 'en-US',
      'ml': 'ml-IN',
      'ta': 'ta-IN',
      'hi': 'hi-IN'
    };
    return langMap[lang];
  };

  useEffect(() => {
    if (!isSupported) return;

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLanguageCode(language);
      setRecognition(recognition);
    }

    // Initialize Speech Synthesis
    if (window.speechSynthesis) {
      setSynthesis(window.speechSynthesis);
    }
  }, [isSupported, language]);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!recognition) return;

    setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const speak = useCallback((text: string) => {
    if (!synthesis) return;

    // Cancel any ongoing speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to find a voice that matches the language
    const voices = synthesis.getVoices();
    const targetLang = getLanguageCode(language);
    const matchingVoice = voices.find(voice => voice.lang.startsWith(targetLang.split('-')[0]));
    
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    synthesis.speak(utterance);
  }, [synthesis, language]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    speak
  };
}
