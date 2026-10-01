(function () {
    'use strict';

    const localeStorageKey = 'copilot-sdk-workshop.locale';
    const localeSelector = document.getElementById('localeSelector');
    const startLink = document.getElementById('startWorkshopLink');
    let locale = WorkshopLocalization.resolveLocale(
        window.location.search,
        getStoredValue(localeStorageKey)
    );

    function getStoredValue(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function storeValue(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // Local storage can be unavailable in private browsing contexts.
        }
    }

    function applyLocale() {
        const messages = WorkshopLocalization.getMessages(locale.id);
        document.documentElement.lang = locale.id;
        document.title = messages.pageTitle;
        document.querySelector('meta[name="description"]').content = messages.pageDescription;
        localeSelector.value = locale.id;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            element.textContent = messages[element.dataset.i18n];
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            element.setAttribute('aria-label', messages[element.dataset.i18nAriaLabel]);
        });
        document.querySelectorAll('.theme-toggle').forEach(button => {
            button.dataset.lightLabel = messages.themeLight;
            button.dataset.darkLabel = messages.themeDark;
            button.dataset.switchToLight = messages.switchToLight;
            button.dataset.switchToDark = messages.switchToDark;
        });
        updateToggleIcon();
        startLink.href = WorkshopNavigation.firstLessonUrl(locale.id);
    }

    localeSelector.addEventListener('change', () => {
        locale = WorkshopLocalization.getLocale(localeSelector.value);
        storeValue(localeStorageKey, locale.id);
        const url = new URL(window.location.href);
        url.searchParams.set('locale', locale.id);
        window.history.replaceState({}, '', url);
        applyLocale();
    });

    applyLocale();
    storeValue(localeStorageKey, locale.id);
}());
