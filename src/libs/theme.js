const theme = () => {
  const html = document.querySelector("html");
  const isDark = document.querySelector("main")?.classList?.contains("is-dark");
  if (isDark) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  // Get theme from localStorage, default to light if not set
  const currentMode = localStorage.getItem("theme") || "light";
  if (currentMode === "dark") {
    html.classList.add("dark");
  } else {
    // Default to light theme
    html.classList.remove("dark");
  }

  // Handle theme toggle
  const themeController = document.querySelector(".theme-controller");
  if (themeController) {
    themeController.addEventListener("click", function () {
      html.classList.toggle("dark");
      const currentMode = html.classList.contains("dark");
      if (currentMode) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }
};

export default theme;
