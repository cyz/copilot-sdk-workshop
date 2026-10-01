(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.WorkshopNavigation = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const sdk = Object.freeze({
        displayName: 'Node.js',
        docsUrl: 'https://github.com/github/copilot-sdk/tree/main/nodejs',
        installCommand: 'npm install @github/copilot-sdk'
    });
    const firstStepId = 'museum-00-preflight';

    function lessonUrl(stepId, locale) {
        const parameters = new URLSearchParams({ step: stepId });
        if (locale) {
            parameters.set('locale', locale);
        }
        return `?${parameters.toString()}`;
    }

    function homeUrl(locale) {
        return locale
            ? `../index.html?${new URLSearchParams({ locale }).toString()}`
            : '../index.html';
    }

    function firstLessonUrl(locale) {
        return `workshop/step.html${lessonUrl(firstStepId, locale)}`;
    }

    function siteRootUrl(lessonPageUrl) {
        return new URL('../', lessonPageUrl);
    }

    return Object.freeze({ sdk, firstStepId, lessonUrl, homeUrl, firstLessonUrl, siteRootUrl });
}));
