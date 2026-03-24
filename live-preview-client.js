(() => {
  if (!/^http/.test(location.protocol)) return;

  let lastVersion = null;

  async function checkVersion() {
    try {
      const response = await fetch(`./__live?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const version = (await response.text()).trim();
      if (!version) return;
      if (lastVersion === null) {
        lastVersion = version;
        return;
      }
      if (version !== lastVersion) {
        location.reload();
      }
    } catch (_) {
    }
  }

  checkVersion();
  setInterval(checkVersion, 1500);
})();
