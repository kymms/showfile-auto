
(function () {
  "use strict";

  const TRACKER_URL =
    "https://m32-visitor-tracker.diditspirit.workers.dev/visit";

  function startVisitorTracker() {
    const tg = window.Telegram?.WebApp;

    if (!tg || !tg.initData) {
      return;
    }

    // Mencegah pengiriman ganda dalam satu halaman.
    if (window.__visitorTrackerStarted) {
      return;
    }

    window.__visitorTrackerStarted = true;

    fetch(TRACKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        initData: tg.initData
      })
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        return response.json();
      })
      .then(data => {
        if (!data.ok) {
          console.error("Visitor Tracker: invalid response");
        }
      })
      .catch(error => {
        console.error("Visitor Tracker:", error.message);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startVisitorTracker,
      { once: true }
    );
  } else {
    startVisitorTracker();
  }
})();
