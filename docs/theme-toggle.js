(function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.dataset.theme =
        savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
})();

function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    updateToggleIcon();
}

function updateToggleIcon() {
    const isLight = document.documentElement.dataset.theme === 'light';
    document.querySelectorAll('.theme-toggle').forEach(button => {
        const lightLabel = button.dataset.lightLabel ?? 'Light';
        const darkLabel = button.dataset.darkLabel ?? 'Dark';
        const switchToLight = button.dataset.switchToLight ?? 'Switch to light theme';
        const switchToDark = button.dataset.switchToDark ?? 'Switch to dark theme';
        button.textContent = isLight ? `🌙 ${darkLabel}` : `☀️ ${lightLabel}`;
        button.setAttribute('aria-label', isLight ? switchToDark : switchToLight);
    });
}

document.addEventListener('DOMContentLoaded', updateToggleIcon);
