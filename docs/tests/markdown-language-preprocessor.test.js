'use strict';

const assert = require('node:assert/strict');
const { getLanguage } = require('../language-registry.js');
const {
    firstLessonUrl,
    homeUrl,
    lessonUrl,
    resolveLanguage,
    siteRootUrl
} = require('../language-navigation.js');
const { preprocessLanguageDirectives } = require('../markdown-language-preprocessor.js');
const {
    format,
    getLocale,
    getMessages,
    resolveLocale
} = require('../localization.js');

const preprocess = (markdown, languageId) =>
    preprocessLanguageDirectives(markdown, languageId, getLanguage);

assert.equal(
    preprocess('Shared\n:::language dotnet\n.NET only\n:::\n:::language python\nPython only\n:::\nEnd', 'dotnet'),
    'Shared\n.NET only\nEnd'
);
assert.equal(
    preprocess('Shared\n:::language dotnet\n.NET only\n:::\n:::language python\nPython only\n:::\nEnd', 'python'),
    'Shared\nPython only\nEnd'
);
assert.throws(
    () => preprocess(':::language dotnet\n:::language python\n:::\n:::', 'dotnet'),
    /cannot be nested/
);
assert.throws(() => preprocess(':::language unknown\n:::', 'dotnet'), /unknown language/);
assert.throws(() => preprocess(':::language dotnet\nUnclosed', 'dotnet'), /not closed/);
assert.throws(() => preprocess(':::', 'dotnet'), /closing directive has no open/);
assert.throws(() => preprocess(':::unexpected', 'dotnet'), /expected :::language/);

assert.equal(lessonUrl('04-mcp-safety', 'rust'), '?step=04-mcp-safety&lang=rust');
assert.equal(lessonUrl('04-mcp-safety'), '?step=04-mcp-safety');
assert.equal(
    lessonUrl('04-mcp-safety', 'rust', 'pt-BR'),
    '?step=04-mcp-safety&lang=rust&locale=pt-BR'
);
assert.equal(firstLessonUrl('java'), 'workshop/step.html?step=00-preflight&lang=java');
assert.equal(firstLessonUrl('python', 'museum'), 'workshop/step.html?step=museum-00-preflight&lang=python');
assert.equal(
    firstLessonUrl('python', 'museum', 'pt-BR'),
    'workshop/step.html?step=museum-00-preflight&lang=python&locale=pt-BR'
);
assert.equal(homeUrl('python'), '../index.html?lang=python');
assert.equal(homeUrl('python', 'museum'), '../index.html?lang=python&workshop=museum');
assert.equal(
    homeUrl('python', 'museum', 'pt-BR'),
    '../index.html?lang=python&workshop=museum&locale=pt-BR'
);
assert.equal(homeUrl(), '../index.html');
assert.equal(
    siteRootUrl('https://expert-adventure-l67eo16.pages.github.io/workshop/step.html?step=00-preflight').href,
    'https://expert-adventure-l67eo16.pages.github.io/'
);
assert.equal(
    siteRootUrl('https://github.github.io/copilot-sdk-workshop/workshop/step.html').href,
    'https://github.github.io/copilot-sdk-workshop/'
);
assert.equal(resolveLanguage('?lang=go', 'rust', getLanguage).id, 'go');
assert.equal(resolveLanguage('', 'rust', getLanguage).id, 'rust');
assert.equal(resolveLanguage('?lang=unknown', 'rust', getLanguage), null);

assert.equal(resolveLocale('', null).id, 'en');
assert.equal(resolveLocale('?locale=pt-BR', null).id, 'pt-BR');
assert.equal(resolveLocale('?locale=PT-br', null).id, 'pt-BR');
assert.equal(resolveLocale('', 'pt-BR').id, 'pt-BR');
assert.equal(resolveLocale('?locale=unknown', 'pt-BR').id, 'pt-BR');
assert.equal(getLocale('unknown'), null);
assert.equal(getMessages('unknown').pageTitle, getMessages('en').pageTitle);
assert.equal(
    format('{workshop} usará o SDK para {language}.', {
        workshop: 'Accessibility Reviewer',
        language: 'Python'
    }),
    'Accessibility Reviewer usará o SDK para Python.'
);

console.log('Workshop language directive and navigation tests passed.');
