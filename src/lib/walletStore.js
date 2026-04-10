// Shared wallet state via localStorage so all pages stay in sync

const KEY = "mitusa_wallet";

export function saveWallet(walletInfo) {
  try {
    localStorage.setItem(KEY, JSON.stringify(walletInfo));
    window.dispatchEvent(new CustomEvent("walletChanged", { detail: walletInfo }));
  } catch {}
}

export function loadWallet() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearWallet() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("walletChanged", { detail: null }));
  } catch {}
}

// Hook to subscribe to wallet changes across pages
export function useSharedWallet() {
  const [wallet, setWallet] = (typeof window !== "undefined")
    ? [loadWallet(), (v) => { saveWallet(v); setWallet(v); }]
    : [null, () => {}];
  return wallet;
}