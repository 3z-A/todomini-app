import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  applyTelegramThemeVars,
  getTelegramWebApp,
  getUserLabel,
  isInsideTelegram,
} from "./lib/telegram";

function App() {
  const [payloadSent, setPayloadSent] = useState<string | null>(null);
  const webApp = useMemo(() => getTelegramWebApp(), []);
  const isTelegram = isInsideTelegram();

  useEffect(() => {
    if (!webApp) {
      return;
    }

    applyTelegramThemeVars(webApp);
    webApp.ready();
    webApp.expand();
  }, [webApp]);

  const userLabel = useMemo(() => {
    return getUserLabel(webApp?.initDataUnsafe.user);
  }, [webApp]);

  const handleSendSample = () => {
    const message = {
      type: "mini_app_ready",
      timestamp: new Date().toISOString(),
      source: "todobot-mini-app",
    };

    if (webApp) {
      webApp.sendData(JSON.stringify(message));
      setPayloadSent(JSON.stringify(message));
      return;
    }

    setPayloadSent(`${JSON.stringify(message)} (debug mode)`);
  };

  useEffect(() => {
    if (!webApp) {
      return;
    }

    const onMainButtonClick = () => handleSendSample();
    webApp.MainButton.setParams({ text: "Send Data To Bot" });
    webApp.MainButton.show();
    webApp.MainButton.onClick(onMainButtonClick);

    return () => {
      webApp.MainButton.offClick(onMainButtonClick);
      webApp.MainButton.hide();
    };
  }, [webApp]);

  return (
    <div className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Telegram Mini App</p>
        <h1>TodoBot Control Panel</h1>
        <p className="subtitle">
          Start point for your Telegram bot app with typed Telegram SDK and a
          working data bridge to the bot.
        </p>
      </section>

      <section className="meta-grid">
        <article className="meta-card">
          <h2>Status</h2>
          <p>{isTelegram ? "Running inside Telegram" : "Running in browser"}</p>
        </article>
        <article className="meta-card">
          <h2>User</h2>
          <p>{userLabel}</p>
        </article>
        <article className="meta-card">
          <h2>Platform</h2>
          <p>{webApp?.platform ?? "web"}</p>
        </article>
        <article className="meta-card">
          <h2>Version</h2>
          <p>{webApp?.version ?? "not connected"}</p>
        </article>
      </section>

      <section className="actions">
        <button type="button" className="primary-button" onClick={handleSendSample}>
          Send sample payload
        </button>
      </section>

      {payloadSent && (
        <section className="log-card">
          <h2>Last payload</h2>
          <pre>{payloadSent}</pre>
        </section>
      )}
    </div>
  );
}

export default App;
