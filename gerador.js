// 1. Configurações de cada loteria
const configsLoterias = {
    megasena: { qtd: 6, max: 60, cor: "#209852" },
    lotofacil: { qtd: 15, max: 25, cor: "#930089" },
    quina: { qtd: 5, max: 80, cor: "#260085" },
    lotomania: { qtd: 50, max: 99, cor: "#f7941d" },
    duplasena: { qtd: 6, max: 50, cor: "#4b2511" },
    diadesorte: { qtd: 7, max: 31, cor: "#cb8221" },
    supersete: { qtd: 7, max: 9, especial: 'colunas', cor: "#00b1d9" },
    maismilionaria: { qtd: 6, max: 50, trevos: 2, maxTrevos: 6, cor: "#0153a5" }
};

// 2. Função principal (Acionada pelo botão)
function gerarNumeros() {
    const seletor = document.getElementById('tipoJogoGerador');
    const tipo = seletor.value;
    const config = configsLoterias[tipo];
    const area = document.getElementById('areaNumeros');
    
    // Limpa a área de sorteio antes de gerar novos
    area.innerHTML = ""; 

    let numeros = [];

    // Lógica para o Super Sete (7 colunas, cada uma de 0 a 9)
    if (config.especial === 'colunas') {
        for (let i = 0; i < 7; i++) {
            numeros.push(Math.floor(Math.random() * 10));
        }
    } else {
        // Lógica para os demais jogos (números sem repetição)
        while (numeros.length < config.qtd) {
            let n = Math.floor(Math.random() * config.max) + 1;
            
            // Caso especial Lotomania (00 a 99)
            if (tipo === 'lotomania') n = Math.floor(Math.random() * 100);
            
            if (!numeros.includes(n)) {
                numeros.push(n);
            }
        }
        // Ordena os números (exceto no Super Sete, onde a ordem das colunas importa)
        numeros.sort((a, b) => a - b);
    }

    // 3. Criar e exibir as bolinhas
    numeros.forEach(num => {
        const bolinha = document.createElement('div');
        bolinha.className = 'bolinha';
        
        // Formatação visual: adiciona o "0" na frente se for menor que 10
        let displayNum = num;
        if (num < 10 && tipo !== 'supersete') displayNum = `0${num}`;
        if (num === 0 && tipo === 'lotomania') displayNum = '00';
        
        bolinha.innerText = displayNum;
        area.appendChild(bolinha);
    });

    // 4. Lógica extra para +Milionária (Trevos)
    if (config.trevos) {
        const tituloTrevo = document.createElement('p');
        tituloTrevo.style.width = "100%";
        tituloTrevo.style.margin = "20px 0 10px";
        tituloTrevo.style.fontWeight = "bold";
        tituloTrevo.innerText = "Trevos:";
        area.appendChild(tituloTrevo);

        let trevos = [];
        while (trevos.length < config.trevos) {
            let t = Math.floor(Math.random() * config.maxTrevos) + 1;
            if (!trevos.includes(t)) {
                trevos.push(t);
                const bolaTrevo = document.createElement('div');
                bolaTrevo.className = 'bolinha trevo';
                bolaTrevo.innerText = t;
                area.appendChild(bolaTrevo);
            }
        }
    }
}

// 5. Atualização visual do botão
function mudarCorBotao() {
    const tipo = document.getElementById('tipoJogoGerador').value;
    const btn = document.getElementById('btnGerar');
    if (configsLoterias[tipo]) {
        btn.style.backgroundColor = configsLoterias[tipo].cor;
    }
}

// Garante que a cor inicie correta e os eventos funcionem
document.addEventListener('DOMContentLoaded', () => {
    mudarCorBotao();
    document.getElementById('tipoJogoGerador').addEventListener('change', mudarCorBotao);
});

// Função para Limpar a tela
function limparTudo() {
    document.getElementById('areaNumeros').innerHTML = "";
}

// Função para Copiar os números gerados
function copiarNumeros() {
    const area = document.getElementById('areaNumeros');
    const bolinhas = area.querySelectorAll('.bolinha:not(.trevo)');
    const trevos = area.querySelectorAll('.trevo');
    
    if (bolinhas.length === 0) {
        alert("Gere um jogo primeiro!");
        return;
    }

    // Extrai o texto das bolinhas e junta com traços
    let textoCopiar = Array.from(bolinhas).map(b => b.innerText).join(' - ');

    // Se houver trevos (+Milionária), adiciona-os ao texto
    if (trevos.length > 0) {
        let textoTrevos = Array.from(trevos).map(t => t.innerText).join(' e ');
        textoCopiar += ` | Trevos: ${textoTrevos}`;
    }

    // Comando para copiar para o clipboard (Área de Transferência)
    navigator.clipboard.writeText(textoCopiar).then(() => {
        // Feedback visual simples
        const btn = event.target;
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        setTimeout(() => { btn.innerHTML = textoOriginal; }, 2000);
    });
}