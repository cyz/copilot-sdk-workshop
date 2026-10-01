(function () {
    'use strict';

    const storageKey = 'copilot-sdk-workshop.language';
    const localeStorageKey = 'copilot-sdk-workshop.locale';
    const localeSelector = document.getElementById('localeSelector');
    const picker = document.getElementById('languagePicker');
    const languageInputs = [...document.querySelectorAll('input[name="language"]')];
    const startLink = document.getElementById('startWorkshopLink');
    const docsLink = document.getElementById('sdkDocsLink');
    const summary = document.getElementById('languageSummary');
    const installCommand = document.getElementById('installCommand');
    const runtimeNote = document.getElementById('runtimeNote');
    const workshopInputs = [...document.querySelectorAll('input[name="workshop"]')];
    const targetAppLink = document.getElementById('targetAppLink');
    const previewTitle = document.getElementById('previewTitle');
    const preview = document.getElementById('workshopPreview');
    const startGuidance = document.getElementById('startGuidance');
    let selectedWorkshopId = null;

    const workshopMetadata = {
        sdlc: {
            previewTitle: 'accessibility-reviewer',
        },
        museum: {
            previewTitle: 'museum-exhibit-studio',
        }
    };
    let locale = WorkshopLocalization.resolveLocale(
        window.location.search,
        getStoredValue(localeStorageKey)
    );
    let messages = WorkshopLocalization.getMessages(locale.id);

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

    function getStoredLanguageId() {
        try {
            return getStoredValue(storageKey);
        } catch (error) {
            return null;
        }
    }

    function storeLanguageId(languageId) {
        try {
            storeValue(storageKey, languageId);
        } catch (error) {
            // Local storage can be unavailable in private browsing contexts.
        }
    }

    function applyLocale() {
        messages = WorkshopLocalization.getMessages(locale.id);
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
    }

    function updateSelection(languageId) {
        const language = WorkshopLanguages.getLanguage(languageId);
        const hasLanguage = language !== null;
        const workshop = selectedWorkshopId ? messages.workshops[selectedWorkshopId] : null;
        const ready = workshop !== null && hasLanguage;

        picker.disabled = workshop === null;
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.language === language?.id);
        });
        startLink.classList.toggle('disabled', !ready);
        startLink.setAttribute('aria-disabled', String(!ready));
        startLink.href = ready
            ? WorkshopLanguageNavigation.firstLessonUrl(language.id, selectedWorkshopId, locale.id)
            : workshop ? '#language-picker' : '#workshop-picker';
        startLink.textContent = ready
            ? WorkshopLocalization.format(messages.startWorkshop, { workshop: workshop.name })
            : messages.startSelected;
        targetAppLink.hidden = selectedWorkshopId !== 'sdlc';

        if (!hasLanguage) {
            docsLink.removeAttribute('href');
            docsLink.setAttribute('aria-disabled', 'true');
            summary.textContent = workshop
                ? WorkshopLocalization.format(messages.nowChooseLanguage, { workshop: workshop.name })
                : messages.chooseWorkshopThenLanguage;
            installCommand.textContent = '';
            runtimeNote.textContent = '';
            startGuidance.textContent = workshop?.guidance ?? messages.startGuidance;
            return;
        }

        docsLink.href = language.docsUrl;
        docsLink.removeAttribute('aria-disabled');
        docsLink.textContent = WorkshopLocalization.format(messages.sdkDocsFor, {
            language: language.displayName
        });
        summary.textContent = workshop
            ? WorkshopLocalization.format(messages.workshopUsesSdk, {
                workshop: workshop.name,
                language: language.displayName
            })
            : messages.chooseWorkshopToContinue;
        installCommand.textContent = language.installCommand;
        runtimeNote.textContent = messages.runtimeNotes?.[language.id] ?? language.runtimeNote;
        startGuidance.textContent = workshop?.guidance ?? messages.chooseWorkshopToContinue;
    }

    function selectWorkshop(workshopId) {
        selectedWorkshopId = workshopMetadata[workshopId] ? workshopId : null;
        document.querySelectorAll('.workshop-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.workshop === selectedWorkshopId);
        });
        const metadata = selectedWorkshopId ? workshopMetadata[selectedWorkshopId] : null;
        const workshop = selectedWorkshopId ? messages.workshops[selectedWorkshopId] : null;
        previewTitle.textContent = metadata?.previewTitle ?? 'workshop-preview';
        preview.textContent = workshop?.preview ?? messages.previewPlaceholder;
        updateSelection(languageInputs.find(input => input.checked)?.value ?? null);
        if (workshop) {
            languageInputs[0].focus();
        }
    }

    languageInputs.forEach(input => {
        input.addEventListener('change', () => {
            const language = WorkshopLanguages.getLanguage(input.value);
            storeLanguageId(language.id);
            updateSelection(language.id);
        });
    });

    workshopInputs.forEach(input => {
        input.addEventListener('change', () => selectWorkshop(input.value));
    });

    localeSelector.addEventListener('change', () => {
        locale = WorkshopLocalization.getLocale(localeSelector.value);
        storeValue(localeStorageKey, locale.id);
        const url = new URL(window.location.href);
        url.searchParams.set('locale', locale.id);
        window.history.replaceState({}, '', url);
        applyLocale();
        updateSelection(languageInputs.find(input => input.checked)?.value ?? null);
        if (selectedWorkshopId) {
            const workshop = messages.workshops[selectedWorkshopId];
            preview.textContent = workshop.preview;
        }
    });

    startLink.addEventListener('click', event => {
        if (startLink.getAttribute('aria-disabled') === 'true') {
            event.preventDefault();
            if (!selectedWorkshopId) {
                workshopInputs[0].focus();
            } else {
                languageInputs[0].focus();
                languageInputs[0].reportValidity();
            }
        }
    });

    applyLocale();
    storeValue(localeStorageKey, locale.id);

    const initialLanguage = WorkshopLanguageNavigation.resolveLanguage(
        window.location.search,
        getStoredLanguageId(),
        WorkshopLanguages.getLanguage
    );
    if (initialLanguage) {
        const matchingLanguage = languageInputs.find(input => input.value === initialLanguage.id);
        matchingLanguage.checked = true;
        storeLanguageId(initialLanguage.id);
    }

    const requestedWorkshop = new URLSearchParams(window.location.search).get('workshop');
    const matchingWorkshop = workshopInputs.find(input => input.value === requestedWorkshop);
    if (matchingWorkshop) {
        matchingWorkshop.checked = true;
        selectWorkshop(matchingWorkshop.value);
    } else {
        updateSelection(initialLanguage?.id ?? null);
    }
}());
