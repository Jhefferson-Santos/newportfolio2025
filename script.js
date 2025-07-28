// Função para buscar repositórios do GitHub
async function carregarRepositorios() {
    const username = "Jhefferson-Santos"; // Define o nome de usuário do GitHub
    const apiUrl = `https://api.github.com/users/${username}/repos`; // URL da API do GitHub
    const languageList = document.getElementById("language-list"); // Seleciona a lista de linguagens
    const chartCanvas = document.getElementById("languageChart"); // Seleciona o canvas do gráfico

    try {
        const response = await fetch(apiUrl); // Faz a requisição à API

        if (!response.ok) {
            throw new Error(`Erro ao buscar repositórios do GitHub. Status: ${response.status}`);
        }

        const repos = await response.json(); // Converte a resposta para JSON

        // Contador de linguagens
        const linguagens = {};

        repos.forEach(repo => {
            if (repo.language) {
                linguagens[repo.language] = (linguagens[repo.language] || 0) + 1; // Conta ocorrências de cada linguagem
            }
        });

        // Exibir lista de linguagens
        languageList.innerHTML = ""; // Limpa a lista existente
        Object.entries(linguagens).forEach(([linguagem, qtd]) => {
            const cor = gerarCorAleatoria(); // Gera uma cor aleatória para cada linguagem
            const li = document.createElement("li"); // Cria um item de lista
            li.innerHTML = `<span class="lang-color" style="background-color: ${cor}"></span>${linguagem} (${qtd})`;
            languageList.appendChild(li); // Adiciona o item à lista
        });

        // Criar gráfico de linguagens
        const chart = new Chart(chartCanvas, {
            type: "pie", // Tipo de gráfico (pizza)
            data: {
                labels: Object.keys(linguagens), // Nomes das linguagens
                datasets: [{
                    data: Object.values(linguagens), // Quantidade de repositórios por linguagem
                    backgroundColor: Object.keys(linguagens).map(() => gerarCorAleatoria()) // Cores aleatórias
                }]
            },
            options: {
                responsive: true, // Gráfico responsivo
                plugins: {
                    legend: {
                        labels: {
                            color: "#fff" // Cor branca para legendas
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao carregar repositórios:", error); // Loga erros no console
    }
}

// Função para gerar uma cor aleatória em formato hexadecimal
function gerarCorAleatoria() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    // Gera um número aleatório, converte para hexadecimal e garante 6 dígitos
}

// Jogo de adivinhação
let numeroAleatorio = Math.floor(Math.random() * 50) + 1; // Gera número aleatório de 1 a 50
let tentativas = 5; // Define o número de tentativas

document.getElementById("btn-palpite").addEventListener("click", () => {
    const palpite = parseInt(document.getElementById("palpite").value); // Obtém o palpite
    const resultado = document.getElementById("resultado"); // Elemento para exibir resultado
    const tentativasRestantes = document.getElementById("tentativas-restantes"); // Elemento para tentativas

    if (isNaN(palpite) || palpite < 1 || palpite > 50) {
        resultado.textContent = "Por favor, digite um número entre 1 e 50.";
        return; // Sai se o palpite for inválido
    }

    tentativas--; // Decrementa as tentativas

    if (palpite === numeroAleatorio) {
        resultado.textContent = `Parabéns! Você acertou o número ${numeroAleatorio}.`;
        document.getElementById("btn-palpite").disabled = true; // Desativa o botão de palpite
        document.getElementById("btn-reiniciar").style.display = "inline-block"; // Mostra botão de reiniciar
    } else if (tentativas > 0) {
        resultado.textContent = palpite < numeroAleatorio
            ? "Tente um número maior."
            : "Tente um número menor."; // Dá uma dica
        tentativasRestantes.textContent = `Tentativas restantes: ${tentativas}`;
    } else {
        resultado.textContent = `Suas tentativas acabaram! O número era ${numeroAleatorio}.`;
        tentativasRestantes.textContent = ""; // Limpa as tentativas
        document.getElementById("btn-palpite").disabled = true; // Desativa o botão
        document.getElementById("btn-reiniciar").style.display = "inline-block"; // Mostra reiniciar
    }
});

document.getElementById("btn-reiniciar").addEventListener("click", () => {
    numeroAleatorio = Math.floor(Math.random() * 50) + 1; // Novo número aleatório
    tentativas = 5; // Reseta tentativas
    document.getElementById("resultado").textContent = ""; // Limpa resultado
    document.getElementById("tentativas-restantes").textContent = ""; // Limpa tentativas
    document.getElementById("palpite").value = ""; // Limpa campo de entrada
    document.getElementById("btn-palpite").disabled = false; // Reativa botão de palpite
    document.getElementById("btn-reiniciar").style.display = "none"; // Esconde reiniciar
});

// Navegação entre seções
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o comportamento padrão do link
        const targetId = link.getAttribute('href').substring(1); // Obtém o ID da seção
        const targetSection = document.getElementById(targetId); // Seleciona a seção

        // Esconde todas as seções
        document.querySelectorAll('section.container').forEach(section => {
            section.classList.remove('active'); // Remove a classe active
        });

        // Mostra a seção clicada
        targetSection.classList.add('active'); // Adiciona a classe active

        // Remove a classe active de todos os links
        document.querySelectorAll('nav a').forEach(navLink => {
            navLink.classList.remove('active'); // Remove destaque
        });

        // Adiciona a classe active ao link clicado
        link.classList.add('active'); // Destaca o link atual
    });
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarRepositorios(); // Carrega os repositórios do GitHub
    // Garante que a seção "Sobre" esteja ativa ao carregar a página
    document.querySelector('section#Sobre').classList.add('active');
});

// Ocultar cabeçalho ao rolar para baixo e mostrar ao rolar para cima
let lastScrollTop = 0;

window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.classList.add("hide"); // Esconde
    } else {
        header.classList.remove("hide"); // Mostra
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

