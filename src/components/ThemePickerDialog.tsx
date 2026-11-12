import React from 'react';
import {
  X,
  Moon,
  Sun,
  Monitor,
  Palette,
  Languages,
  Check
} from 'lucide-react';
import { AppThemeMode, AppLanguage } from '../types';

interface Props {
  currentThemeMode: AppThemeMode;
  isDynamicColorEnabled: boolean;
  currentLanguage: AppLanguage;
  onThemeModeSelected: (mode: AppThemeMode) => void;
  onDynamicColorToggled: (enabled: boolean) => void;
  onLanguageSelected: (lang: AppLanguage) => void;
  onDismiss: () => void;
}

export const ThemePickerDialog: React.FC<Props> = ({
  currentThemeMode,
  isDynamicColorEnabled,
  currentLanguage,
  onThemeModeSelected,
  onDynamicColorToggled,
  onLanguageSelected,
  onDismiss
}) => {
  const isFrench = currentLanguage === 'FR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFrench ? 'Thème & Langue' : 'Theme & Language'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFrench ? 'Personnalisation de l\'interface' : 'Customize interface appearance'}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme mode options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {isFrench ? 'Mode d\'Affichage' : 'Theme Mode'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'DARK' as AppThemeMode, label: isFrench ? 'Sombre' : 'Dark', icon: <Moon className="w-4 h-4" /> },
              { id: 'LIGHT' as AppThemeMode, label: isFrench ? 'Clair' : 'Light', icon: <Sun className="w-4 h-4" /> },
              { id: 'SYSTEM' as AppThemeMode, label: isFrench ? 'Système' : 'System', icon: <Monitor className="w-4 h-4" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onThemeModeSelected(item.id)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                  currentThemeMode === item.id
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Color Toggle */}
        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-semibold text-slate-200">
              {isFrench ? 'Couleurs Dynamiques (Material You)' : 'Dynamic Color (Material You)'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {isFrench ? 'Adapter la palette à votre système' : 'Adapt palette to system colors'}
            </p>
          </div>
          <div
            onClick={() => onDynamicColorToggled(!isDynamicColorEnabled)}
            className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative p-0.5 shrink-0 ${
              isDynamicColorEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isDynamicColorEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Language selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5" />
            <span>{isFrench ? 'Langue de l\'Application' : 'Application Language'}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'FR' as AppLanguage, label: 'Français 🇫🇷' },
              { id: 'EN' as AppLanguage, label: 'English 🇬🇧' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => onLanguageSelected(lang.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all ${
                  currentLanguage === lang.id
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{lang.label}</span>
                {currentLanguage === lang.id && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onDismiss}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            {isFrench ? 'Terminé' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
