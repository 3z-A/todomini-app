const THEME_KEYS: Array<keyof TelegramWebAppThemeParams> = [
  "bg_color",
  "text_color",
  "button_color",
  "button_text_color",
  "hint_color",
  "link_color",
  "secondary_bg_color",
];

const CSS_VAR_MAP: Record<keyof TelegramWebAppThemeParams, string> = {
  bg_color: "--tg-bg-color",
  text_color: "--tg-text-color",
  button_color: "--tg-button-color",
  button_text_color: "--tg-button-text-color",
  hint_color: "--tg-hint-color",
  link_color: "--tg-link-color",
  secondary_bg_color: "--tg-secondary-bg-color",
  accent_text_color: "--tg-accent-text-color",
  destructive_text_color: "--tg-destructive-text-color",
  header_bg_color: "--tg-header-bg-color",
  section_bg_color: "--tg-section-bg-color",
  section_header_text_color: "--tg-section-header-text-color",
  section_separator_color: "--tg-section-separator-color",
  subtitle_text_color: "--tg-subtitle-text-color",
};

export const getTelegramWebApp = (): TelegramWebApp | null => {
  return window.Telegram?.WebApp ?? null;
};

export const isInsideTelegram = (): boolean => {
  return Boolean(getTelegramWebApp());
};

export const applyTelegramThemeVars = (webApp: TelegramWebApp): void => {
  const root = document.documentElement;

  for (const key of THEME_KEYS) {
    const value = webApp.themeParams[key];
    if (value) {
      root.style.setProperty(CSS_VAR_MAP[key], value);
    }
  }
};

export const getUserLabel = (user?: TelegramWebAppUser): string => {
  if (!user) {
    return "Guest";
  }

  if (user.username) {
    return `@${user.username}`;
  }

  return [user.first_name, user.last_name].filter(Boolean).join(" ");
};


