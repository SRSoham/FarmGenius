interface LanguageSelectorProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  onLanguageChange: (language: 'en' | 'ml' | 'ta' | 'hi') => void;
}

const languages = [
  { code: 'en' as const, label: 'EN' },
  { code: 'ml' as const, label: 'മലയാളം' },
  { code: 'ta' as const, label: 'தமிழ்' },
  { code: 'hi' as const, label: 'हिं' },
];

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex space-x-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors touch-target ${
            language === lang.code
              ? 'language-active'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          data-testid={`language-${lang.code}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
