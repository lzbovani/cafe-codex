const produtos = [
  { nome: 'Blend Imperial 250g', descricao: 'Notas de chocolate 70% e caramelo.', preco: 'R$ 39,90' },
  { nome: 'Origem Única Cerrado 500g', descricao: 'Doçura natural, corpo médio e final limpo.', preco: 'R$ 69,90' },
  { nome: 'Edição Espresso 1kg', descricao: 'Crema intensa e baixa acidez para espresso.', preco: 'R$ 119,90' }
];

const lista = document.getElementById('lista-produtos');
const STORAGE_KEY = 'cafe_codex_click_ranking_v1';

function criarCards() {
  produtos.forEach((produto) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h4>${produto.nome}</h4>
      <p>${produto.descricao}</p>
      <span class="price">${produto.preco}</span>
      <a class="btn" href="#" data-produto="${produto.nome}" data-preco="${produto.preco}">Comprar</a>
    `;
    lista.appendChild(card);
  });
}

function lerRankingLocal() {
  const cru = localStorage.getItem(STORAGE_KEY);
  if (!cru) return {};

  try {
    return JSON.parse(cru);
  } catch (_erro) {
    return {};
  }
}

function salvarRankingLocal(ranking) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ranking));
}

function registrarCliqueLocal(productName, priceLabel) {
  const ranking = lerRankingLocal();
  const chave = `${productName}||${priceLabel}`;

  if (!ranking[chave]) {
    ranking[chave] = { productName, priceLabel, totalClicks: 0 };
  }

  ranking[chave].totalClicks += 1;
  salvarRankingLocal(ranking);
}

function obterRankingLocalOrdenado() {
  const ranking = lerRankingLocal();
  return Object.values(ranking).sort((a, b) => b.totalClicks - a.totalClicks);
}

async function registrarClique(productName, priceLabel) {
  try {
    await fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, priceLabel })
    });
  } catch (_erro) {
    registrarCliqueLocal(productName, priceLabel);
  }
}

async function obterRanking() {
  try {
    const resposta = await fetch('/api/ranking');
    if (!resposta.ok) throw new Error('Falha de API');
    const dados = await resposta.json();
    return dados.ranking || [];
  } catch (_erro) {
    return obterRankingLocalOrdenado();
  }
}

document.addEventListener('click', async (e) => {
  const botaoCompra = e.target.closest('[data-produto]');
  if (botaoCompra) {
    e.preventDefault();
    const produto = botaoCompra.getAttribute('data-produto');
    const preco = botaoCompra.getAttribute('data-preco');
    await registrarClique(produto, preco);
  }
});

const modal = document.getElementById('modal-ranking');
const rankingLista = document.getElementById('ranking-lista');
const btnRanking = document.getElementById('btn-ranking');
const fecharRanking = document.getElementById('fechar-ranking');

async function carregarRanking() {
  const ranking = await obterRanking();

  if (!ranking.length) {
    rankingLista.innerHTML = '<li>Ainda sem cliques registrados.</li>';
    return;
  }

  rankingLista.innerHTML = '';
  ranking.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.productName} (${item.priceLabel}) - ${item.totalClicks} clique(s)`;
    rankingLista.appendChild(li);
  });
}

btnRanking.addEventListener('click', async () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  await carregarRanking();
});

fecharRanking.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
});

criarCards();
