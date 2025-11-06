// ===================================
// MENU MOBILE
// ===================================

const menuToggle = document.getElementById('menuToggle');
const fullscreenMenu = document.getElementById('fullscreenMenu');
const menuItems = document.querySelectorAll('.menu-item');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    fullscreenMenu.classList.toggle('active');
    document.body.style.overflow = fullscreenMenu.classList.contains('active') ? 'hidden' : '';
});

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===================================
// SCROLL SUAVE
// ===================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===================================
// ANIMAÇÕES DE SCROLL
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .stat-item').forEach(el => {
    observer.observe(el);
});

// ===================================
// CONTADOR DE ESTATÍSTICAS
// ===================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (element.parentElement.querySelector('.stat-label').textContent.includes('%') ? '' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target.querySelector('.stat-number');
            if (counter && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                animateCounter(counter);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(item => {
    statsObserver.observe(item);
});

// ===================================
// SISTEMA DE CONSULTORIA
// ===================================

let consultoriaData = {
    nome: '',
    negocio: '',
    objetivo: '',
    prazo: '',
    orcamento: ''
};

let perguntaAtual = 0;
const totalPerguntas = 5;

const perguntas = [
    {
        id: 'nome',
        tipo: 'texto',
        pergunta: '👋 Olá! Sou a consultora virtual da MIVORA. Qual é o seu nome?',
        placeholder: 'Digite seu nome...'
    },
    {
        id: 'negocio',
        tipo: 'texto',
        pergunta: (nome) => `Prazer, ${nome}! 😊 Qual é o seu negócio ou área de atuação?`,
        placeholder: 'Ex: Loja de roupas, Consultoria...'
    },
    {
        id: 'objetivo',
        tipo: 'opcoes',
        pergunta: 'Perfeito! Qual é o principal objetivo do seu site?',
        opcoes: [
            '🛍️ Vender produtos online',
            '📢 Divulgar meus serviços',
            '📧 Capturar leads e contatos',
            '⭐ Criar autoridade no mercado'
        ]
    },
    {
        id: 'prazo',
        tipo: 'opcoes',
        pergunta: 'Entendi! Qual o prazo ideal para ter o site pronto?',
        opcoes: [
            '⚡ Urgente (3-7dias)',
            '📅 Normal (20-30 dias)',
            '🕐 Sem pressa (mais de 60 dias)'
        ]
    },
    {
        id: 'orcamento',
        tipo: 'opcoes',
        pergunta: 'Última pergunta! Qual é o seu orçamento para investir?',
        opcoes: [
            '💰 Até R$ 1.500',
            '💎 R$ 1.500 - R$ 3.000',
            '🚀 R$ 3.000 - R$ 5.000',
            '⭐ Acima de R$ 5.000'
        ]
    }
];

const chatArea = document.getElementById('chatArea');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const inputArea = document.getElementById('inputArea');
const optionsArea = document.getElementById('optionsArea');
const resultArea = document.getElementById('resultArea');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

function addMessage(texto, tipo) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${tipo}-message`);
    messageDiv.textContent = texto;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function updateProgress() {
    const progresso = ((perguntaAtual + 1) / totalPerguntas) * 100;
    progressFill.style.width = progresso + '%';
    progressText.textContent = `Pergunta ${perguntaAtual + 1} de ${totalPerguntas}`;
}

function showQuestion() {
    if (perguntaAtual >= totalPerguntas) {
        finalizarConsultoria();
        return;
    }

    const pergunta = perguntas[perguntaAtual];
    let textoPergunta = pergunta.pergunta;

    if (typeof textoPergunta === 'function') {
        textoPergunta = textoPergunta(consultoriaData.nome);
    }

    addMessage(textoPergunta, 'agent');

    if (pergunta.tipo === 'texto') {
        showTextInput(pergunta.placeholder);
    } else if (pergunta.tipo === 'opcoes') {
        showOptions(pergunta.opcoes);
    }

    updateProgress();
}

function showTextInput(placeholder) {
    inputArea.style.display = 'flex';
    optionsArea.innerHTML = '';
    chatInput.placeholder = placeholder;
    chatInput.value = '';
    chatInput.focus();
}

function showOptions(opcoes) {
    inputArea.style.display = 'none';
    optionsArea.innerHTML = '';

    opcoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.classList.add('option-button');
        btn.textContent = opcao;
        btn.onclick = () => selectOption(opcao);
        optionsArea.appendChild(btn);
    });
}

function processResponse(resposta) {
    if (!resposta || resposta.trim() === '') return;

    addMessage(resposta, 'user');

    const pergunta = perguntas[perguntaAtual];
    consultoriaData[pergunta.id] = resposta;

    perguntaAtual++;
    
    setTimeout(() => {
        showQuestion();
    }, 500);
}

function selectOption(opcao) {
    processResponse(opcao);
}

function sendResponse() {
    const resposta = chatInput.value.trim();
    if (resposta) {
        processResponse(resposta);
        chatInput.value = '';
    }
}

function finalizarConsultoria() {
    inputArea.style.display = 'none';
    optionsArea.innerHTML = '';

    progressFill.style.width = '100%';
    progressText.textContent = 'Consultoria Concluída! ✅';

    addMessage('Analisando suas respostas... 🤔', 'agent');

    setTimeout(() => {
        addMessage('Pronto! Encontrei o plano perfeito para você! 🎯', 'agent');
        
        setTimeout(() => {
            const planoRecomendado = recommendPlan();
            showResult(planoRecomendado);
        }, 1000);
    }, 1500);
}

function recommendPlan() {
    const orcamento = consultoriaData.orcamento;

    if (orcamento.includes('Até R$ 1.500')) {
        return {
            nome: 'Plano Básico',
            preco: 'R$ 1.200',
            descricao: 'Perfeito para quem está começando! Um site moderno e responsivo que cabe no seu orçamento.',
            features: [
                '✓ Site responsivo e moderno',
                '✓ Até 5 páginas profissionais',
                '✓ Formulário de contato',
                '✓ SSL e segurança incluídos',
                '✓ Suporte por 30 dias'
            ],
            valor: 1200
        };
    } else if (orcamento.includes('R$ 1.500 - R$ 3.000')) {
        return {
            nome: 'Plano Premium',
            preco: 'R$ 2.500',
            descricao: 'O melhor custo-benefício! Site completo com animações modernas e recursos avançados.',
            features: [
                '✓ Tudo do plano Básico',
                '✓ Até 15 páginas',
                '✓ Animações modernas',
                '✓ Painel administrativo (CMS)',
                '✓ SEO otimizado',
                '✓ Suporte prioritário 90 dias'
            ],
            valor: 2500
        };
    } else {
        return {
            nome: 'Plano Enterprise',
            preco: 'Sob Consulta',
            descricao: 'Solução 100% customizada para o seu negócio. Sem limites de criatividade!',
            features: [
                '✓ Tudo do plano Premium',
                '✓ Páginas ilimitadas',
                '✓ Sistema totalmente customizado',
                '✓ Integrações avançadas',
                '✓ Suporte VIP 24/7'
            ],
            valor: 0
        };
    }
}

function showResult(plano) {
    chatArea.style.display = 'none';
    
    document.getElementById('resultPlan').textContent = plano.nome;
    document.getElementById('resultPrice').textContent = plano.preco;
    document.getElementById('resultDescription').textContent = plano.descricao;

    const featuresList = document.getElementById('resultFeatures');
    featuresList.innerHTML = '';
    plano.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    document.getElementById('resultButton').onclick = () => {
        selecionarPlano(plano.nome, plano.valor);
    };

    resultArea.classList.add('active');
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function reiniciarConsultoria() {
    consultoriaData = {
        nome: '',
        negocio: '',
        objetivo: '',
        prazo: '',
        orcamento: ''
    };
    perguntaAtual = 0;

    chatArea.innerHTML = '';
    chatArea.style.display = 'flex';
    resultArea.classList.remove('active');

    progressFill.style.width = '0%';
    progressText.textContent = 'Pergunta 1 de 5';

    showQuestion();
}

function selecionarPlano(nomePlano, preco) {
    const phone = '5588998581489';
    let mensagem = '';
    
    if (preco === 0 || nomePlano.includes('Enterprise')) {
        mensagem = `Olá! Gostaria de mais informações sobre o ${nomePlano}.`;
    } else {
        mensagem = `Olá! Gostaria de contratar o ${nomePlano} (R$ ${preco}).`;
    }
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Event Listeners
sendButton.addEventListener('click', sendResponse);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendResponse();
    }
});

// Iniciar consultoria ao carregar
window.addEventListener('load', () => {
    showQuestion();
});

// ===================================
// PARALLAX SUAVE NO HERO
// ===================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-image');
            
            if (heroImage && scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            ticking = false;
        });
        ticking = true;
    }
});
