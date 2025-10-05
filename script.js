
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
    projetosContainer.innerHTML = "";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro ao buscar repositórios do GitHub. Status: ${response.status}`);
        }
        const repos = await response.json();

        const linguagens = {};

        repos.forEach(repo => {
            if (repo.language) {
                linguagens[repo.language] = (linguagens[repo.language] || 0) + 1;
            }

            const repoCard = document.createElement("div");
            repoCard.className = "repo-card";
            repoCard.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                <p>${repo.description || "Sem descrição disponível."}</p>
            `;
            projetosContainer.appendChild(repoCard);
        });

        languageList.innerHTML = "";
        Object.entries(linguagens).forEach(([linguagem, qtd]) => {
            const cor = gerarCorAleatoria();
            const li = document.createElement("li");
            li.innerHTML = `<span class="lang-color" style="background-color: ${cor}"></span>${linguagem} (${qtd})`;
            languageList.appendChild(li);
        });

        chartCanvas.style.maxWidth = "300px";
        chartCanvas.style.maxHeight = "300px";

        new Chart(chartCanvas, {
            type: "pie",
            data: {
                labels: Object.keys(linguagens),
                datasets: [{
                    data: Object.values(linguagens),
                    backgroundColor: Object.keys(linguagens).map(() => gerarCorAleatoria())
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: "#fff" }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao carregar repositórios:", error);
        projetosContainer.innerHTML = "<p>Erro ao carregar projetos.</p>";
        languageList.innerHTML = "<li>Erro ao carregar linguagens.</li>";
    }
}

function gerarCorAleatoria() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

let numeroAleatorio = Math.floor(Math.random() * 50) + 1;
let tentativas = 5;

document.getElementById("btn-palpite").addEventListener("click", () => {
    const palpite = parseInt(document.getElementById("palpite").value);
    const resultado = document.getElementById("resultado");
    const tentativasRestantes = document.getElementById("tentativas-restantes");

    if (isNaN(palpite) || palpite < 1 || palpite > 50) {
        resultado.textContent = "Por favor, digite um número entre 1 e 50.";
        return;
    }

    tentativas--;

    if (palpite === numeroAleatorio) {
        resultado.textContent = `Parabéns! Você acertou o número ${numeroAleatorio}.`;
        document.getElementById("btn-palpite").disabled = true;
        document.getElementById("btn-reiniciar").style.display = "inline-block";
    } else if (tentativas > 0) {
        resultado.textContent = palpite < numeroAleatorio
            ? "Tente um número maior."
            : "Tente um número menor.";
        tentativasRestantes.textContent = `Tentativas restantes: ${tentativas}`;
    } else {
        resultado.textContent = `Suas tentativas acabaram! O número era ${numeroAleatorio}.`;
        tentativasRestantes.textContent = "";
        document.getElementById("btn-palpite").disabled = true;
        document.getElementById("btn-reiniciar").style.display = "inline-block";
    }
});

document.getElementById("btn-reiniciar").addEventListener("click", () => {
    numeroAleatorio = Math.floor(Math.random() * 50) + 1;
    tentativas = 5;
    document.getElementById("resultado").textContent = "";
    document.getElementById("tentativas-restantes").textContent = "";
    document.getElementById("palpite").value = "";
    document.getElementById("btn-palpite").disabled = false;
    document.getElementById("btn-reiniciar").style.display = "none";
});


document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        document.querySelectorAll('section.container').forEach(section => {
            section.classList.remove('active');
        });

        targetSection.classList.add('active');

        document.querySelectorAll('nav a').forEach(navLink => {
            navLink.classList.remove('active');
        });

        link.classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    carregarRepositorios();
    document.querySelector('section#Sobre').classList.add('active');
});

let lastScrollTop = 0;

window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const scrollable = document.documentElement.scrollHeight > window.innerHeight;

    if (scrollable) {
        if (scrollTop > lastScrollTop) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }
    } else {
        header.classList.remove("hide");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);






