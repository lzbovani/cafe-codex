const produtos = [
  { nome: 'Blend Imperial 250g', descricao: 'Notas de chocolate 70% e caramelo.', preco: 'R$ 39,90' },
  { nome: 'Origem Única Cerrado 500g', descricao: 'Doçura natural, corpo médio e final limpo.', preco: 'R$ 69,90' },
  { nome: 'Edição Espresso 1kg', descricao: 'Crema intensa e baixa acidez para espresso.', preco: 'R$ 119,90' }
];

const lista = document.getElementById('lista-produtos');
const telefone = '5511999999999';
const apiBase = window.location.origin;

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

async function salvarClique(productName, priceLabel) {
  try {
    await fetch(`${apiBase}/api/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, priceLabel })
    });
  } catch (_error) {
  }
}

function abrirWhatsApp(produto) {
  const texto = encodeURIComponent(`Olá! Quero comprar o ${produto}.`);
  window.open(`https://wa.me/${telefone}?text=${texto}`, '_blank');
}

const linkRodape = document.getElementById('whatsapp-link');
const msgPadrao = encodeURIComponent('Olá! Quero conhecer os cafés gourmet da Ouro do Grão.');
linkRodape.href = `https://wa.me/${telefone}?text=${msgPadrao}`;

document.addEventListener('click', async (e) => {
  const botaoCompra = e.target.closest('[data-produto]');
  if (botaoCompra) {
    e.preventDefault();
    const produto = botaoCompra.getAttribute('data-produto');
    const preco = botaoCompra.getAttribute('data-preco');
    await salvarClique(produto, preco);
    abrirWhatsApp(produto);
  }
});

const modal = document.getElementById('modal-ranking');
const rankingLista = document.getElementById('ranking-lista');
const btnRanking = document.getElementById('btn-ranking');
const fecharRanking = document.getElementById('fechar-ranking');

async function carregarRanking() {
  rankingLista.innerHTML = '<li>Carregando ranking...</li>';

  try {
    const resposta = await fetch(`${apiBase}/api/ranking`);
    const dados = await resposta.json();
    const ranking = dados.ranking || [];

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
  } catch (_error) {
    rankingLista.innerHTML = '<li>Não foi possível carregar agora.</li>';
  }
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
