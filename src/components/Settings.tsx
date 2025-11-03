"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/lib/store/settings";
import { useAuthStore } from "@/lib/store/auth";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { X, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

interface SettingsProps {
  onClose?: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const { logout } = useAuthStore();
  const {
    theme: storedTheme,
    language: storedLanguage,
    autoRefreshInterval,
    setLanguage,
    setAutoRefreshInterval,
    setTheme: setStoredTheme,
  } = useSettingsStore();


  const handleLanguageChange = (newLanguage: 'zh' | 'en') => {
    setLanguage(newLanguage);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const handleIntervalChange = (interval: number) => {
    setAutoRefreshInterval(interval);
  };

  const handleLogout = () => {
    if (confirm(t('logoutConfirm') || '确认退出登录？')) {
      logout();
    }
  };

  const intervalOptions = [
    { label: t('never'), value: 0 },
    { label: `10 ${t('seconds')}`, value: 10000 },
    { label: `30 ${t('seconds')}`, value: 30000 },
    { label: `1 ${t('minutes')}`, value: 60000 },
    { label: `5 ${t('minutes')}`, value: 300000 },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('settingsTitle')}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{t('settingsDesc')}</p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-xl md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Appearance Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t('appearance')}</h3>
                <p className="text-sm text-muted-foreground">{t('appearanceDesc')}</p>
              </div>

              <Separator />

              {/* Theme */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('theme')}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((themeOption) => (
                    <Button
                      key={themeOption}
                      variant={storedTheme === themeOption ? 'default' : 'outline'}
                      onClick={() => handleThemeChange(themeOption as 'light' | 'dark' | 'system')}
                      className="rounded-xl"
                    >
                      {t(themeOption)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('language')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={storedLanguage === 'zh' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('zh')}
                    className="rounded-xl"
                  >
                    中文
                  </Button>
                  <Button
                    variant={storedLanguage === 'en' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('en')}
                    className="rounded-xl"
                  >
                    English
                  </Button>
                </div>
              </div>
            </div>

            {/* General Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t('general')}</h3>
                <p className="text-sm text-muted-foreground">{t('generalDesc')}</p>
              </div>

              <Separator />

              {/* Auto Refresh Interval */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('autoRefreshInterval')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {intervalOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={autoRefreshInterval === option.value ? 'default' : 'outline'}
                      onClick={() => handleIntervalChange(option.value)}
                      className="rounded-xl"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t('account')}</h3>
                <p className="text-sm text-muted-foreground">{t('accountDesc')}</p>
              </div>

              <Separator />

              {/* Logout Button */}
              <div className="space-y-3">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}