'use strict';

const assert = require('node:assert/strict');
const {
    firstLessonUrl,
    homeUrl,
    lessonUrl,
    sdk,
    siteRootUrl
} = require('../navigation.js');
const {
    format,
    getLocale,
    getMessages,
    locales,
    resolveLocale
} = require('../localization.js');

assert.equal(sdk.displayName, 'Node.js');
assert.equal(lessonUrl('museum-04-approved-facts'), '?step=museum-04-approved-facts');
assert.equal(
    lessonUrl('museum-04-approved-facts', 'pt-BR'),
    '?step=museum-04-approved-facts&locale=pt-BR'
);
assert.equal(firstLessonUrl(), 'workshop/step.html?step=museum-00-preflight');
assert.equal(firstLessonUrl('pt-BR'), 'workshop/step.html?step=museum-00-preflight&locale=pt-BR');
assert.equal(homeUrl(), '../index.html');
assert.equal(homeUrl('pt-BR'), '../index.html?locale=pt-BR');
assert.equal(
    siteRootUrl('https://expert-adventure-l67eo16.pages.github.io/workshop/step.html?step=museum-00-preflight').href,
    'https://expert-adventure-l67eo16.pages.github.io/'
);
assert.equal(
    siteRootUrl('https://github.github.io/copilot-sdk-workshop/workshop/step.html').href,
    'https://github.github.io/copilot-sdk-workshop/'
);

assert.equal(resolveLocale('', null).id, 'en');
assert.equal(resolveLocale('?locale=pt-BR', null).id, 'pt-BR');
assert.equal(resolveLocale('?locale=PT-br', null).id, 'pt-BR');
assert.equal(resolveLocale('', 'pt-BR').id, 'pt-BR');
assert.equal(resolveLocale('?locale=unknown', 'pt-BR').id, 'pt-BR');
assert.equal(getLocale('unknown'), null);
assert.equal(getMessages('unknown').pageTitle, getMessages('en').pageTitle);
assert.equal(format('Etapa {number} de {count}', { number: 2, count: 7 }), 'Etapa 2 de 7');

// Every locale must define the same message keys as English, so no UI string falls back silently.
const keysOf = value => Object.entries(value).flatMap(([key, nested]) =>
    nested && typeof nested === 'object' && key !== 'steps'
        ? keysOf(nested).map(child => `${key}.${child}`)
        : [key]);
const englishKeys = keysOf(getMessages('en')).sort();
for (const locale of locales) {
    assert.deepEqual(keysOf(getMessages(locale.id)).sort(), englishKeys, `${locale.id} message keys`);
}

console.log('Workshop navigation and localization tests passed.');
