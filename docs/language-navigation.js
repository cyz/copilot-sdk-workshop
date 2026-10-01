(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.WorkshopLanguageNavigation = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    function resolveLanguage(search, storedLanguageId, getLanguage) {
        const parameters = new URLSearchParams(search);
        if (parameters.has('lang')) {
            return getLanguage(parameters.get('lang'));
        }
        return getLanguage(storedLanguageId);
    }

    function lessonUrl(stepId, languageId, locale) {
        const parameters = new URLSearchParams({ step: stepId });
        if (languageId) {
            parameters.set('lang', languageId);
        }
        if (locale) {
            parameters.set('locale', locale);
        }
        return `?${parameters.toString()}`;
    }

    function homeUrl(languageId, workshopId, locale) {
        const parameters = new URLSearchParams();
        if (languageId) {
            parameters.set('lang', languageId);
        }
        if (workshopId) {
            parameters.set('workshop', workshopId);
        }
        if (locale) {
            parameters.set('locale', locale);
        }
        const query = parameters.toString();
        return query ? `../index.html?${query}` : '../index.html';
    }

    function firstLessonUrl(languageId, workshopId = 'sdlc', locale) {
        const firstStep = workshopId === 'museum'
            ? 'museum-00-preflight'
            : '00-preflight';
        return `workshop/step.html${lessonUrl(firstStep, languageId, locale)}`;
    }

    function siteRootUrl(lessonPageUrl) {
        return new URL('../', lessonPageUrl);
    }

    return Object.freeze({ resolveLanguage, lessonUrl, homeUrl, firstLessonUrl, siteRootUrl });
}));
