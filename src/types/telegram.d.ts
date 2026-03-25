export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }

  interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }

  interface TelegramWebAppInitDataUnsafe {
    query_id?: string;
    user?: TelegramWebAppUser;
    auth_date?: number;
    hash?: string;
    start_param?: string;
  }

  interface TelegramWebAppThemeParams {
    bg_color?: string;
    secondary_bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    header_bg_color?: string;
    accent_text_color?: string;
    section_bg_color?: string;
    section_header_text_color?: string;
    section_separator_color?: string;
    subtitle_text_color?: string;
    destructive_text_color?: string;
  }

  interface TelegramMainButton {
    text: string;
    color?: string;
    textColor?: string;
    isVisible: boolean;
    isActive: boolean;
    show(): void;
    hide(): void;
    setParams(params: { text?: string; color?: string; text_color?: string }): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: TelegramWebAppInitDataUnsafe;
    version: string;
    platform: string;
    colorScheme: "light" | "dark";
    themeParams: TelegramWebAppThemeParams;
    isExpanded: boolean;
    MainButton: TelegramMainButton;
    ready(): void;
    expand(): void;
    close(): void;
    sendData(data: string): void;
  }
}
