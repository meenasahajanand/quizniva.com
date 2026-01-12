(function () {
  if (typeof window === "undefined") return;

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    if (data.action === "redirect" && data.url) {
      console.log("🔀 Redirecting to:", data.url);
      window.location.href = data.url;
    }
  });
})();