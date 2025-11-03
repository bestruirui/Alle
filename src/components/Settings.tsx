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
    <div className="flex h-full flex-col bg-card/95">
      <div className="relative flex-shrink-0 border-b-[4px] border-border bg-card/98 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div
            className="absolute top-5 left-8 w-8 h-8 rounded-full border-[3px] border-[var(--memphis-cyan)]"
            style={{ animation: "memphisPulse 3s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-4 right-10 w-12 h-12"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: "var(--memphis-yellow)",
            }}
          />
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--memphis-pink)] to-[var(--memphis-purple)] border-[3px] border-border flex items-center justify-center shadow-[6px_6px_0_var(--memphis-cyan)]">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wide text-foreground">
                  {t('settingsTitle')}
                </h2>
                <p className="text-sm font-semibold text-muted-foreground mt-1">
                  {t('settingsDesc')}
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-xl border-[2px] border-transparent hover:border-[var(--memphis-purple)] hover:bg-[var(--memphis-purple)]/10 md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="relative p-6 space-y-8">
            <div className="absolute inset-0 pointer-events-none opacity-15">
              <div className="memphis-pattern-grid absolute inset-0" />
            </div>

            <div className="relative z-10 space-y-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-foreground mb-1">
                  {t('appearance')}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('appearanceDesc')}
                </p>
              </div>

              <Separator className="border-border/50" />

              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider">
                  {t('theme')}
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((themeOption) => (
                    <Button
                      key={themeOption}
                      variant={storedTheme === themeOption ? 'default' : 'outline'}
                      onClick={() => handleThemeChange(themeOption as 'light' | 'dark' | 'system')}
                      className={`rounded-xl border-[3px] font-bold uppercase tracking-wide transition-all ${
                        storedTheme === themeOption
                          ? 'bg-gradient-to-r from-[var(--memphis-pink)] to-[var(--memphis-purple)] text-white'
                          : 'hover:shadow-[4px_4px_0_var(--memphis-cyan)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                      }`}
                    >
                      {t(themeOption)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider">
                  {t('language')}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={storedLanguage === 'zh' ? 'default' : 'outline'}
                    onClick={() => setLanguage('zh')}
                    className={`rounded-xl border-[3px] font-bold uppercase tracking-wide transition-all ${
                      storedLanguage === 'zh'
                        ? 'bg-gradient-to-r from-[var(--memphis-yellow)] to-[var(--memphis-pink)] text-foreground'
                        : 'hover:shadow-[4px_4px_0_var(--memphis-cyan)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }`}
                  >
                    中文
                  </Button>
                  <Button
                    variant={storedLanguage === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className={`rounded-xl border-[3px] font-bold uppercase tracking-wide transition-all ${
                      storedLanguage === 'en'
                        ? 'bg-gradient-to-r from-[var(--memphis-yellow)] to-[var(--memphis-cyan)] text-foreground'
                        : 'hover:shadow-[4px_4px_0_var(--memphis-cyan)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }`}
                  >
                    English
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-foreground mb-1">
                  {t('general')}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('generalDesc')}
                </p>
              </div>

              <Separator className="border-border/50" />

              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider">
                  {t('autoRefreshInterval')}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {intervalOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={autoRefreshInterval === option.value ? 'default' : 'outline'}
                      onClick={() => setAutoRefreshInterval(option.value)}
                      className={`rounded-xl border-[3px] font-bold uppercase tracking-wide transition-all ${
                        autoRefreshInterval === option.value
                          ? 'bg-gradient-to-r from-[var(--memphis-cyan)] to-[var(--memphis-purple)] text-white'
                          : 'hover:shadow-[4px_4px_0_var(--memphis-yellow)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-foreground mb-1">
                  {t('account')}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('accountDesc')}
                </p>
              </div>

              <Separator className="border-border/50" />

              <div className="space-y-3">
                <DeleteDialog
                  trigger={
                    <Button
                      variant="destructive"
                      className="memphis-btn w-full rounded-xl bg-gradient-to-r from-[var(--memphis-pink)] to-[var(--memphis-purple)] py-3 text-sm font-black uppercase tracking-widest text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
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
