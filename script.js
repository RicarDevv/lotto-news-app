// 1. Definições de Configuração
const limiteDezenasPorJogo = {
    megasena: 6,
    lotofacil: 15,
    quina: 5,
    lotomania: 20,
    duplasena: 6,
    diadesorte: 7,
    supersete: 7,
    maismilionaria: 6
};

const coresLoterias = {
    megasena: "#209852",
    lotofacil: "#930089",
    quina: "#260085",
    lotomania: "#f7941d",
    duplasena: "#4b2511",
    diadesorte: "#cb8221",
    supersete: "#00b1d9",
    maismilionaria: "#0153a5"
};

// 2. Função para Carregar e Processar o CSV
async function carregarDadosCSV(tipoJogo) {
    try {
        // IMPORTANTE: O nome do arquivo aqui deve ser exatamente o nome na pasta HistoricoDeJogos
        const caminhoArquivo = `HistoricoDeJogos/${tipoJogo}.csv`;
        console.log(`Solicitando: ${caminhoArquivo}`);
        
        const response = await fetch(caminhoArquivo);
        
        if (!response.ok) {
            throw new Error(`Arquivo "${tipoJogo}.csv" não encontrado na pasta HistoricoDeJogos.`);
        }

        const texto = await response.text();
        const linhas = texto.split(/\r?\n/);
        const resultados = [];
        const quantidadePermitida = limiteDezenasPorJogo[tipoJogo] || 6;

        // Processamento das linhas (pula o cabeçalho)
        for (let i = 1; i < linhas.length; i++) {
            if (!linhas[i].trim()) continue;

            // Tenta separar por ponto e vírgula (padrão Caixa)
            let colunas = linhas[i].split(';');
            
            // Se não encontrar colunas, tenta por vírgula
            if (colunas.length <= 1) colunas = linhas[i].split(',');

            if (colunas.length > 1) {
                const concurso = colunas[0].trim().replace(/"/g, '');
                
                // Extrai apenas as dezenas puras
                const dezenas = colunas.slice(1)
                    .map(n => n.trim().replace(/"/g, ''))
                    .filter(n => n !== "" && !isNaN(n))
                    .slice(0, quantidadePermitida)
                    .map(Number);

                if (dezenas.length === quantidadePermitida) {
                    resultados.push({ concurso, dezenas });
                }
            }
        }
        return resultados;

    } catch (error) {
        console.error("Detalhes do erro:", error);
        throw error; // Repassa o erro para ser tratado na função verificarJogo
    }
}

// 3. Função Principal de Verificação
async function verificarJogo() {
    const tipoJogo = document.getElementById('tipoJogo').value;
    const input = document.getElementById('numerosUsuario').value;
    const divResultado = document.getElementById('resultado');

    if (!input.trim()) {
        divResultado.innerHTML = `<span style="color:orange">Por favor, digite os números do jogo.</span>`;
        return;
    }

    divResultado.innerHTML = "Processando banco de dados...";

    try {
        const historico = await carregarDadosCSV(tipoJogo);

        if (historico.length === 0) {
            divResultado.innerHTML = "O arquivo foi lido, mas não encontramos sorteios válidos dentro dele.";
            return;
        }

        // Limpa entrada do usuário
        const meusNumeros = [...new Set(input.split(/[\s,.;|-]+/)
                                 .filter(n => n !== "" && !isNaN(n))
                                 .map(Number))];

        let melhorResultado = { acertos: 0, concurso: null, dezenas: [] };

        // Busca o melhor desempenho
        historico.forEach(sorteio => {
            const acertosNoSorteio = sorteio.dezenas.filter(num => meusNumeros.includes(num));
            if (acertosNoSorteio.length > melhorResultado.acertos) {
                melhorResultado = {
                    acertos: acertosNoSorteio.length,
                    concurso: sorteio.concurso,
                    dezenas: sorteio.dezenas
                };
            }
        });

        exibirAnalise(melhorResultado, tipoJogo);

    } catch (error) {
        divResultado.innerHTML = `<span style="color:red">Erro: ${error.message}</span>`;
    }
}

// 4. Interface e Visual
function exibirAnalise(melhor, jogoNome) {
    const divResultado = document.getElementById('resultado');
    const nomeExibicao = document.querySelector(`#tipoJogo option[value="${jogoNome}"]`).text;

    if (melhor.acertos === 0) {
        divResultado.style.color = "red";
        divResultado.innerHTML = `Nenhum acerto encontrado em todo o histórico da ${nomeExibicao}.`;
    } else {
        const cor = coresLoterias[jogoNome] || "#333";
        divResultado.innerHTML = `
            <div style="border: 2px solid ${cor}; padding: 15px; border-radius: 10px;">
                <p style="margin:0;">Melhor resultado na <strong>${nomeExibicao}</strong>:</p>
                <h1 style="color: ${cor}; margin: 10px 0;">${melhor.acertos} ACERTOS</h1>
                <p>No Concurso: <strong>${melhor.concurso}</strong></p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <small style="color: #666;">Dezenas deste sorteio:<br> ${melhor.dezenas.join(' - ')}</small>
            </div>
        `;
    }
}

function atualizarCorBotao() {
    const jogoSelecionado = document.getElementById('tipoJogo').value;
    const botao = document.querySelector('button');
    if (coresLoterias[jogoSelecionado]) {
        botao.style.backgroundColor = coresLoterias[jogoSelecionado];
    }
}

// 5. Inicialização
document.getElementById('tipoJogo').addEventListener('change', atualizarCorBotao);
window.onload = atualizarCorBotao;

