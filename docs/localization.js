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
            pageTitle: 'Choose your workshop | GitHub Copilot SDK',
            pageDescription: 'Choose a hands-on GitHub Copilot SDK workshop: build an SDLC accessibility reviewer or a grounded museum curator.',
            skipLink: 'Skip to workshop overview',
            homeLabel: 'GitHub Copilot SDK Workshop home',
            resourcesLabel: 'Workshop resources',
            targetApp: 'Target app ↗',
            sdkDocs: '📚 SDK docs ↗',
            localeLabel: 'Content language',
            themeLight: 'Light',
            themeDark: 'Dark',
            switchToLight: 'Switch to light theme',
            switchToDark: 'Switch to dark theme',
            heroTitle: 'Choose what your agent is here to do.',
            heroDefinition: 'Two workshops. One SDK. Build an agent for the software lifecycle, or take Copilot into a completely different domain.',
            chooseWorkshop: 'Choose a workshop',
            accessibilityKicker: 'Developer tool · 90 minutes',
            accessibilityTitle: 'Review web accessibility',
            accessibilityDescription: 'Build an SDLC agent that inspects a page, consults WCAG guidance, and produces an evidence-based report.',
            accessibilityCapabilities: 'Streaming · local tools · Playwright MCP · permissions',
            museumKicker: 'Non-SDLC tool · 90 minutes',
            museumTitle: 'Curate a museum exhibit',
            museumDescription: 'Build a grounded interpretive agent that turns approved facts into visitor-ready exhibit copy.',
            museumCapabilities: 'Custom persona · one application-owned tool · validation · evaluation',
            chooseLanguage: 'Choose your workshop language',
            chooseWorkshopFirst: 'Choose a workshop first, then select its implementation language.',
            programmingLanguage: 'Programming language',
            startSelected: 'Start selected workshop',
            startGuidance: 'Choose a workshop and language. No prior agent or SDK experience required.',
            previewLabel: 'Selected workshop preview',
            previewPlaceholder: 'Select a workshop to preview its agent flow.',
            outcomesTitle: 'Build the app. Understand the boundary.',
            outcomeSession: 'Create and manage a Copilot session.',
            outcomePolicy: 'Separate durable agent policy from task data.',
            outcomeTools: 'Choose the right tool surface for the job.',
            outcomeValidation: 'Validate objective output requirements in code.',
            outcomeControls: 'Explain where prompt guidance ends and hard controls begin.',
            lesson: Object.freeze({
                pageDescription: 'Self-guided, multilingual workshops for building agents with the GitHub Copilot SDK.',
                skipLink: 'Skip to lesson',
                openSections: 'Open sections',
                closeSections: 'Close sections',
                homeLabel: 'Copilot SDK Workshop home',
                actionsLabel: 'Lesson actions',
                languageLabel: 'Language',
                languageAriaLabel: 'Workshop programming language',
                chooseLanguage: 'Choose language',
                hub: '🏠 Hub',
                docs: '📚 Docs ↗',
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
                docsFor: '📚 {language} docs ↗',
                chooseLanguagePageTitle: 'Choose a language | Copilot SDK Workshop',
                chooseLanguageHeading: 'Choose a workshop language',
                chooseLanguageDetails: 'Select one of the six supported languages above before loading a lesson.',
                chooseLanguageStatus: 'Choose a workshop language to continue.',
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
            steps: Object.freeze({}),
            nowChooseLanguage: 'Now choose a language for {workshop}.',
            chooseWorkshopThenLanguage: 'Choose a workshop first, then select its implementation language.',
            workshopUsesSdk: '{workshop} will use the {language} SDK.',
            chooseWorkshopToContinue: 'Choose a workshop to continue.',
            sdkDocsFor: '{language} SDK docs ↗',
            startWorkshop: 'Start {workshop}',
            workshops: Object.freeze({
                sdlc: Object.freeze({
                    name: 'Accessibility Reviewer',
                    guidance: 'Build an SDLC developer tool in a 90-minute core workshop.',
                    preview: `URL → Playwright inspection
     → WCAG lookup
     → structured report

[tool] playwright-browser_navigate
[tool] accessibility_rule_lookup

Finding
The name input has no accessible name.`
                }),
                museum: Object.freeze({
                    name: 'Museum Exhibit Studio',
                    guidance: 'Build a non-SDLC curator tool in a 90-minute core workshop.',
                    preview: `Approved facts → curator session
               → exhibit validation
               → visitor-ready copy

Available tools: []
System message: replace

# Journey to the Moon
## Narrative
## Visitor questions`
                })
            })
        }),
        'pt-BR': Object.freeze({
            pageTitle: 'Escolha seu workshop | GitHub Copilot SDK',
            pageDescription: 'Escolha um workshop prático do GitHub Copilot SDK: crie um revisor de acessibilidade para SDLC ou um curador de museu fundamentado em fatos.',
            skipLink: 'Pular para a visão geral do workshop',
            homeLabel: 'Página inicial do GitHub Copilot SDK Workshop',
            resourcesLabel: 'Recursos do workshop',
            targetApp: 'Aplicativo-alvo ↗',
            sdkDocs: '📚 Documentação do SDK ↗',
            localeLabel: 'Idioma do conteúdo',
            themeLight: 'Claro',
            themeDark: 'Escuro',
            switchToLight: 'Mudar para o tema claro',
            switchToDark: 'Mudar para o tema escuro',
            heroTitle: 'Escolha qual será a missão do seu agente.',
            heroDefinition: 'Dois workshops. Um SDK. Crie um agente para o ciclo de vida de software ou leve o Copilot para um domínio completamente diferente.',
            chooseWorkshop: 'Escolha um workshop',
            accessibilityKicker: 'Ferramenta para desenvolvedores · 90 minutos',
            accessibilityTitle: 'Revise a acessibilidade da Web',
            accessibilityDescription: 'Crie um agente de SDLC que inspeciona uma página, consulta orientações das WCAG e produz um relatório baseado em evidências.',
            accessibilityCapabilities: 'Streaming · ferramentas locais · Playwright MCP · permissões',
            museumKicker: 'Ferramenta fora do SDLC · 90 minutos',
            museumTitle: 'Faça a curadoria de uma exposição de museu',
            museumDescription: 'Crie um agente de curadoria baseado em fatos aprovados para produzir textos de exposição claros e adequados ao público.',
            museumCapabilities: 'Persona personalizada · uma ferramenta controlada pelo aplicativo · validação · avaliação',
            chooseLanguage: 'Escolha a linguagem de programação',
            chooseWorkshopFirst: 'Primeiro escolha um workshop. Depois, selecione a linguagem da implementação.',
            programmingLanguage: 'Linguagem de programação',
            startSelected: 'Iniciar workshop selecionado',
            startGuidance: 'Escolha um workshop e uma linguagem. Não é necessário ter experiência prévia com agentes ou com o SDK.',
            previewLabel: 'Prévia do workshop selecionado',
            previewPlaceholder: 'Selecione um workshop para visualizar o fluxo do agente.',
            outcomesTitle: 'Crie o aplicativo. Entenda os limites.',
            outcomeSession: 'Crie e gerencie uma sessão do Copilot.',
            outcomePolicy: 'Separe a política permanente do agente dos dados da tarefa.',
            outcomeTools: 'Escolha o conjunto de ferramentas certo para cada tarefa.',
            outcomeValidation: 'Valide em código os requisitos objetivos da saída.',
            outcomeControls: 'Explique onde termina a orientação do prompt e onde começam os controles efetivos.',
            lesson: Object.freeze({
                pageDescription: 'Workshops autoguiados e multilíngues para criar agentes com o GitHub Copilot SDK.',
                skipLink: 'Pular para a lição',
                openSections: 'Abrir seções',
                closeSections: 'Fechar seções',
                homeLabel: 'Página inicial do Copilot SDK Workshop',
                actionsLabel: 'Ações da lição',
                languageLabel: 'Linguagem',
                languageAriaLabel: 'Linguagem de programação do workshop',
                chooseLanguage: 'Escolha uma linguagem',
                hub: '🏠 Início',
                docs: '📚 Documentação ↗',
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
                docsFor: '📚 Documentação de {language} ↗',
                chooseLanguagePageTitle: 'Escolha uma linguagem | Copilot SDK Workshop',
                chooseLanguageHeading: 'Escolha a linguagem de programação',
                chooseLanguageDetails: 'Selecione uma das seis linguagens disponíveis acima antes de carregar uma lição.',
                chooseLanguageStatus: 'Escolha uma linguagem de programação para continuar.',
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
                '00-preflight': Object.freeze({ title: 'Prepare sua máquina', navTitle: 'Preparação', time: 'Sem tempo definido' }),
                '01-first-session': Object.freeze({ title: 'Crie sua primeira sessão do Copilot', navTitle: 'Primeira sessão' }),
                '02-streaming': Object.freeze({ title: 'Transmita uma resposta', navTitle: 'Streaming' }),
                '03-local-tool': Object.freeze({ title: 'Adicione conhecimento controlado pelo aplicativo', navTitle: 'Ferramenta local' }),
                '04-mcp-safety': Object.freeze({ title: 'Conecte uma ferramenta externa com segurança', navTitle: 'MCP e permissões' }),
                '05-combine-tools': Object.freeze({ title: 'Combine ferramentas locais e MCP', navTitle: 'Combine ferramentas' }),
                '06-structured-report': Object.freeze({ title: 'Produza um relatório estruturado', navTitle: 'Relatório estruturado' }),
                '07-run-explain': Object.freeze({ title: 'Execute e explique o aplicativo', navTitle: 'Execute e explique' }),
                '08-model-selection': Object.freeze({ title: 'Selecione um modelo', navTitle: 'Seleção de modelo' }),
                '09-interactive-html-report': Object.freeze({ title: 'Gere um relatório HTML interativo', navTitle: 'Relatório interativo' }),
                'museum-00-preflight': Object.freeze({ title: 'Prepare o Museum Exhibit Studio', navTitle: 'Preparação', time: 'Sem tempo definido' }),
                'museum-01-first-curator-session': Object.freeze({ title: 'Crie sua primeira sessão do curador', navTitle: 'Primeira sessão' }),
                'museum-02-stream-the-curator': Object.freeze({ title: 'Exiba a resposta do curador em streaming', navTitle: 'Streaming' }),
                'museum-03-curator-voice': Object.freeze({ title: 'Dê voz ao curador', navTitle: 'Voz do curador' }),
                'museum-04-approved-facts': Object.freeze({ title: 'Fundamente o texto em fatos aprovados', navTitle: 'Fatos aprovados' }),
                'museum-05-guardrails': Object.freeze({ title: 'Defina os guardrails', navTitle: 'Guardrails' }),
                'museum-06-prove-the-structure': Object.freeze({ title: 'Comprove a estrutura', navTitle: 'Verificações estruturais' }),
                'museum-07-wikipedia-research': Object.freeze({ title: 'Pesquise com o MCP da Wikipedia', navTitle: 'Pesquisa na Wikipedia' }),
                'museum-08-interactive-exhibit-page': Object.freeze({ title: 'Publique uma página interativa da exposição', navTitle: 'Página da exposição' })
            }),
            runtimeNotes: Object.freeze({
                dotnet: 'Requer o .NET SDK e um runtime de C# compatível.',
                go: 'Requer um toolchain Go compatível e um módulo Go.',
                java: 'Requer um JDK compatível e um projeto Maven ou Gradle.',
                nodejs: 'Requer uma versão LTS atual do Node.js.',
                python: 'Requer Python e um ambiente virtual isolado.',
                rust: 'Requer Rust e Cargo instalados via rustup.'
            }),
            nowChooseLanguage: 'Agora escolha uma linguagem para {workshop}.',
            chooseWorkshopThenLanguage: 'Primeiro escolha um workshop. Depois, selecione a linguagem da implementação.',
            workshopUsesSdk: '{workshop} usará o SDK para {language}.',
            chooseWorkshopToContinue: 'Escolha um workshop para continuar.',
            sdkDocsFor: 'Documentação do SDK para {language} ↗',
            startWorkshop: 'Iniciar {workshop}',
            workshops: Object.freeze({
                sdlc: Object.freeze({
                    name: 'Accessibility Reviewer',
                    guidance: 'Crie uma ferramenta de SDLC para desenvolvedores em um workshop principal de 90 minutos.',
                    preview: `URL → inspeção com Playwright
    → consulta às WCAG
    → relatório estruturado

[ferramenta] playwright-browser_navigate
[ferramenta] accessibility_rule_lookup

Problema encontrado
O campo de nome não tem um nome acessível.`
                }),
                museum: Object.freeze({
                    name: 'Museum Exhibit Studio',
                    guidance: 'Crie uma ferramenta de curadoria, fora do SDLC, em um workshop principal de 90 minutos.',
                    preview: `Fatos aprovados → sessão do curador
                → validação da exposição
                → texto pronto para visitantes

Ferramentas disponíveis: []
Mensagem de sistema: replace

# Viagem à Lua
## Narrativa
## Perguntas dos visitantes`
                })
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