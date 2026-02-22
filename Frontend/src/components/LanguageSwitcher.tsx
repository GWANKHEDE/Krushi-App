import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const currentLanguage = i18n.language === 'mr' ? 'मराठी' : 'English';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 md:h-9 px-2 md:px-3 text-xs md:text-sm font-bold uppercase tracking-widest gap-2 bg-background/50 backdrop-blur-sm border border-primary/10 rounded-xl hover:bg-primary/5 transition-all">
                    <Languages className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                    <span className="hidden sm:inline">{currentLanguage}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl border-primary/10">
                <DropdownMenuItem
                    onClick={() => changeLanguage('en')}
                    className={`text-xs font-bold ${i18n.language === 'en' ? 'bg-primary/10 text-primary' : ''}`}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => changeLanguage('mr')}
                    className={`text-xs font-bold ${i18n.language === 'mr' ? 'bg-primary/10 text-primary' : ''}`}
                >
                    मराठी
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
