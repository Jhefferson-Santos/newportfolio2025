document.addEventListener('DOMContentLoaded', () => {
    // MENU DE NAVEGAÇÃO ENTRE SEÇÕES
    const links = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section.container');

    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === targetId);
        });

        if (targetId === 'Jogos') {
            inicializarJogoAdivinhacao();
        }
    }

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Exibe a seção "Sobre" ao carregar
    showSection('Sobre');

    // JOGO DE ADIVINHAÇÃO
    let numeroAleatorio = null;
    let tentativasRestantes = 5;
    const inputPalpite = document.getElementById('palpite');
    const btnPalpite = document.getElementById('btn-palpite');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const resultado = document.getElementById('resultado');
    const tentativasInfo = document.getElementById('tentativas-restantes');

    function inicializarJogoAdivinhacao() {
        numeroAleatorio = Math.floor(Math.random() * 50) + 1;
        tentativasRestantes = 5;
        inputPalpite.disabled = false;
        btnPalpite.disabled = false;
        btnReiniciar.style.display = 'none';
        resultado.textContent = '';
        resultado.style.color = '';
        tentativasInfo.textContent = `Tentativas restantes: ${tentativasRestantes}`;
        inputPalpite.value = '';
        inputPalpite.focus();
    }

    btnPalpite.addEventListener('click', () => {
        if (!numeroAleatorio) return;

        const palpiteUsuario = parseInt(inputPalpite.value);

        if (isNaN(palpiteUsuario) || palpiteUsuario < 1 || palpiteUsuario > 50) {
            resultado.textContent = 'Por favor, insira um número válido entre 1 e 50.';
            resultado.style.color = 'red';
            inputPalpite.value = '';
            inputPalpite.focus();
            return;
        }

        tentativasRestantes--;

        if (palpiteUsuario === numeroAleatorio) {
            resultado.textContent = `Parabéns! Você acertou o número ${numeroAleatorio}!`;
            resultado.style.color = 'green';
            inputPalpite.disabled = true;
            btnPalpite.disabled = true;
            btnReiniciar.style.display = 'inline-block';
            numeroAleatorio = null;
        } else if (tentativasRestantes === 0) {
            resultado.textContent = `Fim de jogo! O número correto era ${numeroAleatorio}.`;
            resultado.style.color = 'red';
            inputPalpite.disabled = true;
            btnPalpite.disabled = true;
            btnReiniciar.style.display = 'inline-block';
            numeroAleatorio = null;
        } else {
            resultado.textContent = palpiteUsuario < numeroAleatorio
                ? 'O número é maior. Tente novamente!'
                : 'O número é menor. Tente novamente!';
            resultado.style.color = 'orange';
        }

        tentativasInfo.textContent = `Tentativas restantes: ${tentativasRestantes}`;
        inputPalpite.value = '';
        inputPalpite.focus();
    });

    btnReiniciar.addEventListener('click', inicializarJogoAdivinhacao);

    // GRÁFICO DE LINGUAGENS MAIS USADAS NO GITHUB
    const username = 'Jhefferson-Santos';
    const apiUrl = `https://api.github.com/users/${username}/repos`;
    const languageData = {};
    const colors = ['#f1e05a', '#178600', '#563d7c', '#3572A5', '#b07219', '#701516', '#e34c26'];

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar repositórios do GitHub');
            }
            return response.json();
        })
        .then(repos => {
            const languagePromises = repos.map(repo =>
                fetch(repo.languages_url).then(res => {
                    if (!res.ok) {
                        throw new Error('Erro ao buscar linguagens do repositório');
                    }
                    return res.json();
                })
            );

            Promise.all(languagePromises)
                .then(results => {
                    results.forEach(langObj => {
                        for (const lang in langObj) {
                            if (languageData[lang]) {
                                languageData[lang] += langObj[lang];
                            } else {
                                languageData[lang] = langObj[lang];
                            }
                        }
                    });

                    const labels = Object.keys(languageData);
                    const data = Object.values(languageData);

                    // Preencher lista lateral
                    const list = document.getElementById('language-list');
                    list.innerHTML = '';
                    labels.forEach((label, i) => {
                        const li = document.createElement('li');
                        li.innerHTML = `<div class="lang-color" style="background-color: ${colors[i % colors.length]}"></div>${label}`;
                        list.appendChild(li);
                    });

                    // Criar gráfico de pizza
                    const ctx = document.getElementById('languageChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: colors,
                                borderColor: '#1e1e1e',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                    labels: {
                                        color: '#eee',
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                tooltip: {
                                    enabled: true
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar dados das linguagens:', error);
                    document.getElementById('language-list').innerHTML = '<li>Erro ao carregar linguagens. Tente novamente mais tarde.</li>';
                });
        })
        .catch(error => {
            console.error('Erro ao carregar repositórios:', error);
            document.getElementById('language-list').innerHTML = '<li>Erro ao carregar repositórios. Tente novamente mais tarde.</li>';
        });
});
