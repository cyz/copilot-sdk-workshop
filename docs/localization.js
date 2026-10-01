(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.WorkshopLocalization = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const defaultLocale = 'en';
    const locales = Object.freeze([
        Object.freeze({ id: 'en', displayName: 'English' }),
        Object.freeze({ id: 'pt-BR', displayName: 'Português (Brasil)' })
    ]);

    const messages = Object.freeze({
        en: Object.freeze({
            pageTitle: 'Museum Exhibit Studio | GitHub Copilot SDK Workshop',
            pageDescription: 'A hands-on GitHub Copilot SDK workshop in Node.js: build a grounded museum curator agent.',
            skipLink: 'Skip to workshop overview',
            homeLabel: 'GitHub Copilot SDK Workshop home',
            resourcesLabel: 'Workshop resources',
            sdkDocs: '📚 Node.js SDK docs ↗',
            localeLabel: 'Content language',
            themeLight: 'Light',
            themeDark: 'Dark',
            switchToLight: 'Switch to light theme',
            switchToDark: 'Switch to dark theme',
            heroTitle: 'Build a museum curator agent with the GitHub Copilot SDK.',
            heroDefinition: 'One hands-on workshop in Node.js and TypeScript. Take Copilot outside the software lifecycle and turn approved facts into visitor-ready exhibit copy, with the guardrails in your own code.',
            workshopLabel: 'The workshop',
            museumKicker: 'Node.js · TypeScript · 90 minutes',
            museumTitle: 'Curate a museum exhibit',
            museumDescription: 'Build a grounded interpretive agent that turns approved facts into visitor-ready exhibit copy.',
            museumCapabilities: 'Custom persona · one application-owned tool · MCP · validation',
            runtimeNote: 'Requires Node.js 22.12 or newer.',
            startWorkshop: 'Start the workshop',
            startGuidance: 'No prior agent or SDK experience required. Machine setup happens in an untimed preflight.',
            previewLabel: 'Workshop preview',
            preview: `Approved facts → curator session
               → exhibit validation
               → visitor-ready copy

Available tools: []
System message: replace

# Journey to the Moon
## Narrative
## Visitor questions`,
            outcomesTitle: 'Build the app. Understand the boundary.',
            outcomeSession: 'Create and manage a Copilot session.',
            outcomePolicy: 'Separate durable agent policy from task data.',
            outcomeTools: 'Choose the right tool surface for the job.',
            outcomeValidation: 'Validate objective output requirements in code.',
            outcomeControls: 'Explain where prompt guidance ends and hard controls begin.',
            lesson: Object.freeze({
                pageDescription: 'A self-guided workshop for building a museum curator agent with the GitHub Copilot SDK for Node.js.',
                skipLink: 'Skip to lesson',
                openSections: 'Open sections',
                closeSections: 'Close sections',
                homeLabel: 'Copilot SDK Workshop home',
                actionsLabel: 'Lesson actions',
                hub: '🏠 Hub',
                docs: '📚 Node.js docs ↗',
                previous: 'Previous',
                next: 'Next',
                loading: 'Loading',
                loadingLesson: 'Loading lesson.',
                loadingLessonEllipsis: 'Loading lesson...',
                progressLabel: 'Core workshop progress',
                workshopSteps: 'Workshop steps',
                paginationLabel: 'Lesson pagination',
                beforeBegin: 'Before you begin',
                coreWorkshop: 'Core workshop',
                optionalExtension: 'Optional extension',
                preflight: 'Preflight',
                stepOf: 'Step {number} of {count}',
                copy: 'Copy',
                copied: 'Copied',
                copyFailed: 'Copy failed',
                copyCodeBlock: 'Copy code block',
                unableToLoad: 'Unable to load this lesson',
                serveLocally: 'Serve the repository with a local HTTP server; browsers block lesson fetches from file URLs.',
                refreshGuidance: 'Refresh the page. If the problem continues, verify that the workshop Markdown was deployed.',
                unableStatus: 'Unable to load this lesson.',
                lessonRequestFailed: 'Lesson request failed with HTTP {status}.',
                loadedStatus: 'Loaded {title}.',
                loadingStatus: 'Loading {title}.',
                fallbackNotice: 'This lesson is not available in Portuguese yet. Showing the English version.'
            }),
            steps: Object.freeze({})
        }),
        'pt-BR': Object.freeze({
            pageTitle: 'Museum Exhibit Studio | GitHub Copilot SDK Workshop',
            pageDescription: 'Um workshop prático do GitHub Copilot SDK em Node.js: crie um agente curador de museu fundamentado em fatos.',
            skipLink: 'Pular para a visão geral do workshop',
            homeLabel: 'Página inicial do GitHub Copilot SDK Workshop',
            resourcesLabel: 'Recursos do workshop',
            sdkDocs: '📚 Documentação do SDK para Node.js ↗',
            localeLabel: 'Idioma do conteúdo',
            themeLight: 'Claro',
            themeDark: 'Escuro',
            switchToLight: 'Mudar para o tema claro',
            switchToDark: 'Mudar para o tema escuro',
            heroTitle: 'Crie um agente curador de museu com o GitHub Copilot SDK.',
            heroDefinition: 'Um workshop prático em Node.js e TypeScript. Leve o Copilot para fora do ciclo de vida de software e transforme fatos aprovados em textos de exposição prontos para o público, com os guardrails no seu próprio código.',
            workshopLabel: 'O workshop',
            museumKicker: 'Node.js · TypeScript · 90 minutos',
            museumTitle: 'Faça a curadoria de uma exposição de museu',
            museumDescription: 'Crie um agente de curadoria baseado em fatos aprovados para produzir textos de exposição claros e adequados ao público.',
            museumCapabilities: 'Persona personalizada · uma ferramenta controlada pelo aplicativo · MCP · validação',
            runtimeNote: 'Requer Node.js 22.12 ou mais recente.',
            startWorkshop: 'Começar o workshop',
            startGuidance: 'Não é necessário ter experiência prévia com agentes ou com o SDK. A preparação da máquina é feita em uma etapa inicial sem tempo definido.',
            previewLabel: 'Prévia do workshop',
            preview: `Fatos aprovados → sessão do curador
                → validação da exposição
                → texto pronto para visitantes

Ferramentas disponíveis: []
Mensagem de sistema: replace

# Viagem à Lua
## Narrativa
## Perguntas dos visitantes`,
            outcomesTitle: 'Crie o aplicativo. Entenda os limites.',
            outcomeSession: 'Crie e gerencie uma sessão do Copilot.',
            outcomePolicy: 'Separe a política permanente do agente dos dados da tarefa.',
            outcomeTools: 'Escolha o conjunto de ferramentas certo para cada tarefa.',
            outcomeValidation: 'Valide em código os requisitos objetivos da saída.',
            outcomeControls: 'Explique onde termina a orientação do prompt e onde começam os controles efetivos.',
            lesson: Object.freeze({
                pageDescription: 'Um workshop autoguiado para criar um agente curador de museu com o GitHub Copilot SDK para Node.js.',
                skipLink: 'Pular para a lição',
                openSections: 'Abrir seções',
                closeSections: 'Fechar seções',
                homeLabel: 'Página inicial do Copilot SDK Workshop',
                actionsLabel: 'Ações da lição',
                hub: '🏠 Início',
                docs: '📚 Documentação do Node.js ↗',
                previous: 'Anterior',
                next: 'Próxima',
                loading: 'Carregando',
                loadingLesson: 'Carregando lição.',
                loadingLessonEllipsis: 'Carregando lição...',
                progressLabel: 'Progresso do workshop principal',
                workshopSteps: 'Etapas do workshop',
                paginationLabel: 'Paginação das lições',
                beforeBegin: 'Antes de começar',
                coreWorkshop: 'Workshop principal',
                optionalExtension: 'Extensão opcional',
                preflight: 'Preparação',
                stepOf: 'Etapa {number} de {count}',
                copy: 'Copiar',
                copied: 'Copiado',
                copyFailed: 'Falha ao copiar',
                copyCodeBlock: 'Copiar bloco de código',
                unableToLoad: 'Não foi possível carregar esta lição',
                serveLocally: 'Sirva o repositório com um servidor HTTP local. Os navegadores bloqueiam solicitações de lições em URLs file://.',
                refreshGuidance: 'Atualize a página. Se o problema continuar, verifique se o Markdown do workshop foi publicado.',
                unableStatus: 'Não foi possível carregar esta lição.',
                lessonRequestFailed: 'A solicitação da lição falhou com o status HTTP {status}.',
                loadedStatus: 'Lição carregada: {title}.',
                loadingStatus: 'Carregando a lição: {title}.',
                fallbackNotice: 'Esta lição ainda não está disponível em português. A versão em inglês será exibida.'
            }),
            steps: Object.freeze({
                'museum-00-preflight': Object.freeze({ title: 'Prepare o Museum Exhibit Studio', navTitle: 'Preparação', time: 'Sem tempo definido' }),
                'museum-01-first-curator-session': Object.freeze({ title: 'Crie sua primeira sessão do curador', navTitle: 'Primeira sessão' }),
                'museum-02-stream-the-curator': Object.freeze({ title: 'Exiba a resposta do curador em streaming', navTitle: 'Streaming' }),
                'museum-03-curator-voice': Object.freeze({ title: 'Dê voz ao curador', navTitle: 'Voz do curador' }),
                'museum-04-approved-facts': Object.freeze({ title: 'Fundamente o texto em fatos aprovados', navTitle: 'Fatos aprovados' }),
                'museum-05-guardrails': Object.freeze({ title: 'Defina os guardrails', navTitle: 'Guardrails' }),
                'museum-06-prove-the-structure': Object.freeze({ title: 'Comprove a estrutura', navTitle: 'Verificações estruturais' }),
                'museum-07-wikipedia-research': Object.freeze({ title: 'Pesquise com o MCP da Wikipedia', navTitle: 'Pesquisa na Wikipedia' }),
                'museum-08-interactive-exhibit-page': Object.freeze({ title: 'Publique uma página interativa da exposição', navTitle: 'Página da exposição' })
            })
        })
    });

    function getLocale(localeId) {
        return locales.find(locale => locale.id.toLowerCase() === localeId?.toLowerCase()) ?? null;
    }

    function resolveLocale(search, storedLocaleId) {
        const requestedLocale = new URLSearchParams(search).get('locale');
        return getLocale(requestedLocale) ?? getLocale(storedLocaleId) ?? getLocale(defaultLocale);
    }

    function getMessages(localeId) {
        return messages[getLocale(localeId)?.id ?? defaultLocale];
    }

    function format(message, values = {}) {
        return message.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
    }

    return Object.freeze({ defaultLocale, format, getLocale, getMessages, locales, resolveLocale });
}));