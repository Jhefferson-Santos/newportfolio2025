// ===== VARIÁVEIS GLOBAIS =====
let lastScrollTop = 0;
const scrollThreshold = 100;

// ===== FUNÇÃO PARA CARREGAR REPOSITÓRIOS DO GITHUB =====
async function carregarRepositorios() {
    const username = "Jhefferson-Santos";
    const apiUrl = `https://api.github.com/users/${username}/repos`;
    const languageList = document.getElementById("language-list");
    const chartCanvas = document.getElementById("languageChart");
    const projetosSection = document.querySelector("#Projetos");

    let projetosContainer = document.querySelector(".repos-container");
    if (!projetosContainer) {
        projetosContainer = document.createElement("div");
        projetosContainer.classList.add("repos-container");
        projetosSection.appendChild(projetosContainer);
    }
    projetosContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Carregando repositórios...</p>';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro ao buscar repositórios do GitHub. Status: ${response.status}`);
        }
        const repos = await response.json();

        // Filtrar apenas repositórios não-fork
        const reposPublicos = repos.filter(repo => !repo.fork);

        const linguagens = {};

        // Limpar container antes de adicionar novos cards
        projetosContainer.innerHTML = "";

        // Processar cada repositório
        reposPublicos.forEach(repo => {
            // Contar linguagens
            if (repo.language) {
                linguagens[repo.language] = (linguagens[repo.language] || 0) + 1;
            }

            // Criar card do repositório
            const repoCard = document.createElement("div");
            repoCard.className = "repo-card";
            repoCard.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                <p>${repo.description || "Sem descrição disponível."}</p>
            `;
            projetosContainer.appendChild(repoCard);
        });

        // Se não houver repositórios públicos
        if (reposPublicos.length === 0) {
            projetosContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum repositório público encontrado.</p>';
        }

        // Atualizar lista de linguagens
        languageList.innerHTML = "";
        const linguagensOrdenadas = Object.entries(linguagens).sort((a, b) => b[1] - a[1]);
        
        linguagensOrdenadas.forEach(([linguagem, qtd]) => {
            const cor = obterCorLinguagem(linguagem);
            const li = document.createElement("li");
            li.innerHTML = `<span class="lang-color" style="background-color: ${cor}"></span>${linguagem} (${qtd})`;
            languageList.appendChild(li);
        });

        // Criar gráfico de pizza
        if (linguagensOrdenadas.length > 0) {
            new Chart(chartCanvas, {
                type: "doughnut",
                data: {
                    labels: linguagensOrdenadas.map(([lang]) => lang),
                    datasets: [{
                        data: linguagensOrdenadas.map(([, qtd]) => qtd),
                        backgroundColor: linguagensOrdenadas.map(([lang]) => obterCorLinguagem(lang)),
                        borderColor: '#1a1f3a',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#1a1f3a',
                            titleColor: '#64ffda',
                            bodyColor: '#e6e8f0',
                            borderColor: '#2d3561',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } else {
            chartCanvas.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Sem dados de linguagens disponíveis.</p>';
        }

    } catch (error) {
        console.error("Erro ao carregar repositórios:", error);
        projetosContainer.innerHTML = '<p style="text-align: center; color: #e74c3c;">Erro ao carregar projetos. Tente novamente mais tarde.</p>';
        languageList.innerHTML = '<li style="color: #e74c3c;">Erro ao carregar linguagens.</li>';
    }
}

// ===== FUNÇÃO PARA OBTER COR DA LINGUAGEM =====
function obterCorLinguagem(linguagem) {
    const cores = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C#': '#178600',
        'C++': '#f34b7d',
        'C': '#555555',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Kotlin': '#F18E33',
        'Swift': '#ffac45',
        'Shell': '#89e051',
        'Dart': '#00B4AB',
        'Vue': '#41b883',
        'React': '#61dafb'
    };
    return cores[linguagem] || gerarCorAleatoria();
}

// ===== FUNÇÃO PARA GERAR COR ALEATÓRIA =====
function gerarCorAleatoria() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

// ===== NAVEGAÇÃO ENTRE SEÇÕES =====
function configurarNavegacao() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Remover classe active de todas as seções
            document.querySelectorAll('section.container').forEach(section => {
                section.classList.remove('active');
            });

            // Adicionar classe active à seção alvo
            targetSection.classList.add('active');

            // Atualizar links de navegação
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            link.classList.add('active');

            // Fechar menu mobile se estiver aberto
            const nav = document.querySelector('nav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }

            // Scroll suave para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ===== CONTROLE DO HEADER FIXO COM SCROLL =====
function configurarHeaderScroll() {
    window.addEventListener("scroll", function() {
        const header = document.querySelector("header");
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Verificar se a página é rolável
        const isScrollable = document.documentElement.scrollHeight > window.innerHeight;

        // Se a página não for rolável, sempre mostrar o header
        if (!isScrollable) {
            header.classList.remove("hide");
            return;
        }

        // Se a página for rolável, aplicar lógica de esconder/mostrar
        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down - esconde o header
                header.classList.add("hide");
            } else {
                // Scrolling up - mostra o header
                header.classList.remove("hide");
            }
        } else {
            // Próximo ao topo - sempre mostra o header
            header.classList.remove("hide");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

// ===== MENU TOGGLE MOBILE =====
function configurarMenuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Alterar ícone do botão
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
    // Carregar repositórios do GitHub
    carregarRepositorios();

    // Configurar navegação entre seções
    configurarNavegacao();

    // Configurar comportamento do header com scroll
    configurarHeaderScroll();

    // Configurar menu mobile
    configurarMenuMobile();

    // Ativar seção "Sobre" por padrão
    document.querySelector('section#Sobre').classList.add('active');

    // Adicionar animação de entrada suave
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== OTIMIZAÇÃO DE PERFORMANCE =====
// Debounce para eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ACESSIBILIDADE =====
// Adicionar suporte para navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const nav = document.querySelector('nav');
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            const icon = document.querySelector('.menu-toggle i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});
