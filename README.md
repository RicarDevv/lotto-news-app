# lotto-news-app
# 🎰 LottoNews - Central de Inteligência em Loterias

O **LottoNews** é um webapp completo desenvolvido para apostadores que desejam unir intuição com análise de dados. A plataforma oferece ferramentas para conferência de jogos históricos, geração de palpites inteligentes e visualização estatística detalhada.



---

## 🚀 Funcionalidades

### 🔍 1. Consulot (Conferência Histórica)
* Analisa automaticamente seus números contra todo o histórico oficial da loteria selecionada.
* Identifica o concurso onde você teria tido o seu melhor desempenho (maior número de acertos).
* Suporta: Mega-Sena, Lotofácil, Quina, Lotomania, Dupla Sena, Dia de Sorte, Super Sete e +Milionária.

### 🎲 2. Gerador de Surpresinha
* Gera jogos aleatórios respeitando as regras específicas de cada modalidade.
* Inclui lógica para Trevos (+Milionária) e Colunas (Super Sete).
* **Botão Copiar:** Formata os números prontos para serem colados em outros lugares.
* **Botão Limpar:** Reinicia a área de jogo instantaneamente.

### 📊 3. Estatísticas Avançadas
* **Top 10:** Ranking das dezenas mais sorteadas em toda a história de cada jogo.
* **Gráfico Par vs Ímpar:** Visualização em gráfico de pizza sobre o equilíbrio das dezenas, ajudando a validar a tendência do jogo.
* **Processamento de Dados:** Mineração de arquivos CSV em tempo real no navegador.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5/CSS3:** Estrutura e estilização moderna e responsiva.
* **JavaScript (ES6+):** Lógica de processamento, manipulação de arquivos CSV e DOM.
* **Chart.js:** Biblioteca para renderização dos gráficos estatísticos.
* **FontAwesome:** Ícones para uma interface intuitiva.
* **GitHub Pages:** Hospedagem gratuita e segura.

---

## 📂 Estrutura do Projeto

```text
├── index.html          # Landing Page (Página Inicial)
├── consulot.html       # Ferramenta de conferência
├── gerador.html        # Gerador de palpites
├── estatisticas.html   # Painel de estatísticas
├── css/
│   ├── home.css        # Estilos da landing page
│   └── style.css       # Estilos das ferramentas internas
├── js/
│   ├── script.js       # Lógica do verificador
│   ├── gerador.js      # Lógica da surpresinha
│   └── estatisticas.js # Lógica de análise de dados
└── HistoricoDeJogos/   # Base de dados em arquivos .csv
