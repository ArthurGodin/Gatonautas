document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-list');
  if (!container) return;

  fetch('http://localhost:3000/produtos')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar produtos');
      return response.json();
    })
    .then(products => {
      container.innerHTML = ''; // limpa container antes de inserir

      products.forEach(prod => {
        const card = document.createElement('article');
        card.classList.add('product-card');
        card.innerHTML = `
          <img src="${prod.image}" alt="${prod.name}" />
          <h3>${prod.name}</h3>
          <p>${prod.description}</p>
          <strong>R$ ${prod.price.toFixed(2)}</strong>
          <button class="btn-primary" onclick="alert('Produto ${prod.name} adicionado ao carrinho!')">Comprar</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      container.innerHTML = `<p style="color: red;">${error.message}</p>`;
    });
});
