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
import { DeleteDialog } from "@/components/common/DeleteDialog";

export function Settings({ onClose }: { onClose?: () => void }) {
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

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const intervalOptions = [
    { label: t('never'), value: 0 },
    { label: `10 ${t('seconds')}`, value: 10000 },
    { label: `30 ${t('seconds')}`, value: 30000 },
    { label: `1 ${t('minutes')}`, value: 60000 },
    { label: `5 ${t('minutes')}`, value: 300000 },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b-2 border-border px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.5rem] border-2 border-border bg-primary/10 shadow-[0_10px_0_rgba(36,17,61,0.12)]">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <span className="memphis-chip shadow-[0_6px_0_rgba(36,17,61,0.12)]">Settings</span>
              <h2 className="text-xl font-black text-foreground">{t('settingsTitle')}</h2>
              <p className="text-sm text-muted-foreground opacity-80">{t('settingsDesc')}</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-2xl md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-8 px-8 py-8">
            {/* Appearance Section */}
            <div className="memphis-panel space-y-6 px-8 py-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-foreground">{t('appearance')}</h3>
                <p className="text-sm text-muted-foreground opacity-80">{t('appearanceDesc')}</p>
              </div>

              <Separator className="bg-border" />

              {/* Theme */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{t('theme')}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((themeOption) => (
                    <Button
                      key={themeOption}
                      variant={storedTheme === themeOption ? 'default' : 'outline'}
                      onClick={() => handleThemeChange(themeOption as 'light' | 'dark' | 'system')}
                    >
                      {t(themeOption)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{t('language')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={storedLanguage === 'zh' ? 'default' : 'outline'}
                    onClick={() => setLanguage('zh')}
                  >
                    中文
                  </Button>
                  <Button
                    variant={storedLanguage === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                </div>
              </div>
            </div>

            {/* General Section */}
            <div className="memphis-panel space-y-6 px-8 py-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-foreground">{t('general')}</h3>
                <p className="text-sm text-muted-foreground opacity-80">{t('generalDesc')}</p>
              </div>

              <Separator className="bg-border" />

              {/* Auto Refresh Interval */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{t('autoRefreshInterval')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {intervalOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={autoRefreshInterval === option.value ? 'default' : 'outline'}
                      onClick={() => setAutoRefreshInterval(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="memphis-panel space-y-6 px-8 py-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-foreground">{t('account')}</h3>
                <p className="text-sm text-muted-foreground opacity-80">{t('accountDesc')}</p>
              </div>

              <Separator className="bg-border" />

              {/* Logout Button */}
              <div className="space-y-3">
                <DeleteDialog
                  trigger={
                    <Button
                      variant="destructive"
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('logout')}
                    </Button>
                  }
                  title={t('logoutTitle')}
                  description={t('logoutConfirm')}
                  onConfirm={logout}
                  cancelText={t('cancel')}
                  confirmText={t('confirm')}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}