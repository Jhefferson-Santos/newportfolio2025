// script.js
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a'); // Seleciona todos os links do menu
    const sections = document.querySelectorAll('section.container'); // Seleciona todas as seções

    // Função para alternar as seções
    function showSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active'); // Exibe a seção clicada
            } else {
                section.classList.remove('active'); // Oculta as outras seções
            }
        });

        // Adiciona a classe "active" ao link clicado
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === targetId) {
                link.classList.add('active');
            }
        });

        // Inicializa o jogo de adivinhação se a seção "Jogos" estiver ativa
        if (targetId === 'Jogos') {
            inicializarJogoAdivinhacao();
        }
    }

    // Adiciona um evento de clique para cada link do menu
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link
            const targetId = this.getAttribute('href').substring(1); // Obtém o ID da seção alvo
            showSection(targetId); // Chama a função para exibir a seção
        });
    });

    // Exibe a primeira seção por padrão ao carregar a página
    showSection('Jogos');

    // Função para inicializar o jogo de adivinhação
    function inicializarJogoAdivinhacao() {
        const numeroAleatorio = Math.floor(Math.random() * 50) + 1; // Gera um número entre 1 e 50
        let tentativasRestantes = 6;
        const inputPalpite = document.getElementById('palpite');
        const btnPalpite = document.getElementById('btn-palpite');
        const resultado = document.getElementById('resultado');
        const tentativasInfo = document.getElementById('tentativas-restantes');

        // Atualiza o número de tentativas restantes
        tentativasInfo.textContent = `Tentativas restantes: ${tentativasRestantes}`;

        btnPalpite.addEventListener('click', () => {
            const palpiteUsuario = parseInt(inputPalpite.value);

            if (isNaN(palpiteUsuario) || palpiteUsuario < 1 || palpiteUsuario > 100) {
                resultado.textContent = "Por favor, insira um número válido entre 1 e 50.";
                return;
            }

            tentativasRestantes--;

            if (palpiteUsuario === numeroAleatorio) {
                resultado.textContent = `Parabéns! Você acertou o número ${numeroAleatorio}!`;
                resultado.style.color = "green";
                inputPalpite.disabled = true;
                btnPalpite.disabled = true;
            } else if (tentativasRestantes === 0) {
                resultado.textContent = `Fim de jogo! O número correto era ${numeroAleatorio}.`;
                resultado.style.color = "red";
                inputPalpite.disabled = true;
                btnPalpite.disabled = true;
            } else {
                resultado.textContent = palpiteUsuario < numeroAleatorio
                    ? "O número é maior. Tente novamente!"
                    : "O número é menor. Tente novamente!";
                resultado.style.color = "orange";
            }

            tentativasInfo.textContent = `Tentativas restantes: ${tentativasRestantes}`;
            inputPalpite.value = ""; // Limpa o campo de input
        });
    }
});
