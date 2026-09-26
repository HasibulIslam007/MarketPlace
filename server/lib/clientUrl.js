// Shared helper: CLIENT_URL may be a single URL or a comma-separated list.
// Redirects (SSLCommerz callbacks) need ONE canonical URL, so use the first entry.
function firstUrl(value, fallback) {
  const first = String(value || "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean)[0];
  return first || fallback;
}

function getClientUrl() {
  return firstUrl(process.env.CLIENT_URL, "http://localhost:3000");
}

function getServerPublicUrl() {
  return firstUrl(
    process.env.SERVER_PUBLIC_URL || process.env.SERVER_URL,
    "http://localhost:5000"
  );
}

module.exports = { firstUrl, getClientUrl, getServerPublicUrl };
