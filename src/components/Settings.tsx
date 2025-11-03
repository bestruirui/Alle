"use client";

import { motion } from "framer-motion";
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
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <SettingsIcon className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('settingsTitle')}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{t('settingsDesc')}</p>
              </div>
            </motion.div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-xl md:hidden"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
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
            <motion.section 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t('appearance')}</h3>
                <p className="text-sm text-muted-foreground">{t('appearanceDesc')}</p>
              </div>

              <Separator />

              {/* Theme */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('theme')}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((themeOption, index) => (
                    <motion.div
                      key={themeOption}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.2 }}
                    >
                      <Button
                        variant={storedTheme === themeOption ? 'default' : 'outline'}
                        onClick={() => handleThemeChange(themeOption as 'light' | 'dark' | 'system')}
                        className="rounded-xl"
                      >
                        {t(themeOption)}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('language')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '中文', value: 'zh' },
                    { label: 'English', value: 'en' },
                  ].map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.2 }}
                    >
                      <Button
                        variant={storedLanguage === option.value ? 'default' : 'outline'}
                        onClick={() => setLanguage(option.value as 'zh' | 'en')}
                        className="rounded-xl"
                      >
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* General Section */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t('general')}</h3>
                <p className="text-sm text-muted-foreground">{t('generalDesc')}</p>
              </div>

              <Separator />

              {/* Auto Refresh Interval */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('autoRefreshInterval')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {intervalOptions.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.2 }}
                    >
                      <Button
                        variant={autoRefreshInterval === option.value ? 'default' : 'outline'}
                        onClick={() => setAutoRefreshInterval(option.value)}
                        className="rounded-xl"
                      >
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Account Section */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t('account')}</h3>
                <p className="text-sm text-muted-foreground">{t('accountDesc')}</p>
              </div>

              <Separator />

              {/* Logout Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
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
              </motion.div>
            </motion.section>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
