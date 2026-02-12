const limiteDezenas = {
    megasena: 6, lotofacil: 15, quina: 5, lotomania: 20,
    duplasena: 6, diadesorte: 7, supersete: 7, maismilionaria: 6
};

let meuGrafico = null; // Variável global para destruir o gráfico anterior antes de criar um novo

async function calcularEstatisticas() {
    const tipoJogo = document.getElementById('tipoJogoEstatistica').value;
    const areaTabela = document.getElementById('tabelaEstatisticas');
    const loading = document.getElementById('loading');
    const graficoContainer = document.getElementById('graficoContainer');

    loading.style.display = "block";
    graficoContainer.style.display = "none";
    areaTabela.innerHTML = "";

    try {
        const response = await fetch(`HistoricoDeJogos/${tipoJogo}.csv`);
        if (!response.ok) throw new Error("Arquivo CSV não encontrado.");
        
        const texto = await response.text();
        const linhas = texto.split(/\r?\n/);
        const frequencia = {};
        let totalPares = 0;
        let totalImpares = 0;
        const qtdPermitida = limiteDezenas[tipoJogo] || 6;

        for (let i = 1; i < linhas.length; i++) {
            if (!linhas[i].trim()) continue;

            let colunas = linhas[i].split(';');
            if (colunas.length <= 1) colunas = linhas[i].split(',');

            if (colunas.length > 1) {
                const dezenas = colunas.slice(1)
                    .map(n => n.trim().replace(/"/g, ''))
                    .filter(n => n !== "" && !isNaN(n))
                    .slice(0, qtdPermitida)
                    .map(Number);

                dezenas.forEach(num => {
                    // Contagem para o Ranking
                    frequencia[num] = (frequencia[num] || 0) + 1;
                    
                    // Contagem para o Gráfico de Pizza
                    if (num % 2 === 0) totalPares++;
                    else totalImpares++;
                });
            }
        }

        const ranking = Object.entries(frequencia)
            .map(([num, qtd]) => ({ numero: num, total: qtd }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        if (ranking.length === 0) throw new Error("Dados insuficientes.");

        // Renderiza o Gráfico e a Tabela
        graficoContainer.style.display = "block";
        renderizarGrafico(totalPares, totalImpares);
        exibirRanking(ranking);

    } catch (error) {
        areaTabela.innerHTML = `<p style="color:red; text-align:center;">${error.message}</p>`;
    } finally {
        loading.style.display = "none";
    }
}

function renderizarGrafico(pares, impares) {
    const ctx = document.getElementById('pieChartParesImpares').getContext('2d');
    
    // Se já existir um gráfico, destrói para não sobrepor
    if (meuGrafico) {
        meuGrafico.destroy();
    }

    meuGrafico = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pares', 'Ímpares'],
            datasets: [{
                data: [pares, impares],
                backgroundColor: ['#260085', '#f7941d'], // Azul Escuro e Laranja
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Equilíbrio Par vs Ímpar (%)' }
            }
        }
    });
}

function exibirRanking(ranking) {
    const area = document.getElementById('tabelaEstatisticas');
    
    // Proteção extra: se ranking[0] não existir por algum motivo, define max como 1
    const maxFrequencia = (ranking[0] && ranking[0].total) ? ranking[0].total : 1;

    let html = `<table class="ranking-table">
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Frequência</th>
                            <th>Popularidade</th>
                        </tr>
                    </thead>
                    <tbody>`;

    ranking.forEach((item) => {
        const porcentagem = (item.total / maxFrequencia) * 100;
        html += `
            <tr>
                <td><span class="rank-bola">${item.numero < 10 ? '0'+item.numero : item.numero}</span></td>
                <td><strong>${item.total}</strong> vezes</td>
                <td>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${porcentagem}%"></div>
                    </div>
                </td>
            </tr>`;
    });

    html += `</tbody></table>`;
    area.innerHTML = html;
}

// Inicia com a Mega Sena
window.onload = calcularEstatisticas;