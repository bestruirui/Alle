"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/lib/store/settings";
import { Settings as SettingsIcon, LogOut, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import useAuthStore from "@/lib/store/auth";
import useTranslation from "@/lib/hooks/useTranslation";
import DeleteDialog from "@/components/common/DeleteDialog";

export default function Settings() {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const { logout } = useAuthStore();
  const {
    theme: storedTheme,
    language: storedLanguage,
    autoRefreshInterval,
    editMode,
    setLanguage,
    setAutoRefreshInterval,
    setTheme: setStoredTheme,
    setEditMode,
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

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full bg-background"
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('settingsTitle')}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{t('settingsDesc')}</p>
              </div>
            </div>
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
                    onClick={() => setLanguage('zh')}
                    className="rounded-xl"
                  >
                    中文
                  </Button>
                  <Button
                    variant={storedLanguage === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
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

              {/* Edit Mode */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('editMode')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={editMode ? 'default' : 'outline'}
                    onClick={() => setEditMode(true)}
                    className="rounded-xl"
                  >
                    {t('enabled')}
                  </Button>
                  <Button
                    variant={!editMode ? 'default' : 'outline'}
                    onClick={() => setEditMode(false)}
                    className="rounded-xl"
                  >
                    {t('disabled')}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('editModeDesc')}
                </p>
              </div>
              {/* Auto Refresh Interval */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('autoRefreshInterval')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {intervalOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={autoRefreshInterval === option.value ? 'default' : 'outline'}
                      onClick={() => setAutoRefreshInterval(option.value)}
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
                <DeleteDialog
                  trigger={
                    <Button
                      variant="destructive"
                      className="w-full rounded-xl"
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

              {/* Clear Cache Button */}
              <div className="space-y-3">
                <DeleteDialog
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('clearCache')}
                    </Button>
                  }
                  title={t('clearCacheTitle')}
                  description={t('clearCacheConfirmText')}
                  onConfirm={handleClearCache}
                  cancelText={t('cancel')}
                  confirmText={t('confirm')}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
