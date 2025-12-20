import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    setLanguage(language === 'en' ? 'zh-tw' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleToggle}
      className="rounded-full gap-1.5"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm">
        {language === 'en' ? '中文' : 'English'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
