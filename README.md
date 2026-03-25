# TodoBot Mini App Starter

This project is prepared as a Telegram Mini App foundation for your bot.

## What is already prepared

- Telegram WebApp SDK is connected in `public/index.html`.
- TypeScript typings for Telegram WebApp are added in `src/types/telegram.d.ts`.
- Starter Telegram helpers are added in `src/lib/telegram.ts`.
- App UI now:
  - safely works both inside Telegram and in a regular browser;
  - reads Telegram user/platform/version;
  - calls `webApp.ready()` and `webApp.expand()`;
  - sends sample payload to bot with `webApp.sendData(...)`;
  - mirrors same action in Telegram `MainButton`.

## Local run

```bash
npm start
```

Open `http://localhost:3000`.

## Connect to your Telegram bot

1. Publish app to HTTPS host (Telegram requires HTTPS).
2. In BotFather:
   - open your bot settings;
   - set Mini App URL (the page where this app is deployed).
3. Add a button in bot keyboard that opens WebApp.
4. Handle incoming `web_app_data` payload in bot backend.

Example payload sent from this starter:

```json
{
  "type": "mini_app_ready",
  "timestamp": "2026-03-25T12:34:56.000Z",
  "source": "todobot-mini-app"
}
```

## Next implementation steps

1. Add backend validation of `initData` hash for secure auth.
2. Add API layer for your tasks/entities.
3. Replace sample payload with real actions (create/edit/complete task).
4. Add route structure (dashboard, task details, settings).
5. Add loading/error/skeleton states.
