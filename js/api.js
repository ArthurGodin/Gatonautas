document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-list');
  if (!container) return;

  // Show a loading message or animation
  container.innerHTML = '<div class="loader"></div>';
  
  fetch('https://gatonautas-backend.onrender.com/produtos')
    .then(response => {
      if (!response.ok) {
        console.error("Network response was not ok", response);
        throw new Error(`Erro ao carregar produtos (Status: ${response.status})`);
      }
      return response.json();
    })
    .then(products => {
      container.innerHTML = ''; // Clear loading message

      if (!products || products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #555;">Nenhum produto encontrado no momento. Volte em breve!</p>';
        return;
      }

      products.forEach(prod => {
        const card = document.createElement('article');
        card.classList.add('product-card');
        // Ensure product ID is available, assuming 'id' or '_id' from backend
        const productId = prod.id || prod._id || `prod-${Math.random().toString(36).substr(2, 9)}`; 
        
        card.innerHTML = `
          <img src="${prod.image}" alt="${prod.name}" />
          <h3>${prod.name}</h3>
          <p>${prod.description || 'Descrição não disponível.'}</p>
          <strong>R$ ${prod.price ? prod.price.toFixed(2) : 'N/A'}</strong>
          <button onclick="addToCart('${productId}', '${prod.name}', ${prod.price}, '${prod.image}')">Comprar</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
      container.innerHTML = `<p style="color: red; text-align:center; padding: 2rem;">${error.message || 'Não foi possível carregar os produtos. Tente novamente mais tarde.'}</p>`;
    });
});

// Note: Ensure your cart.js is loaded or addToCart is globally available.
// If cart.js is loaded after api.js, you might need to ensure addToCart is defined.
// However, with `defer` on both scripts, and cart.js potentially being included in products.html,
// it should generally work. If not, consider event-based approaches or ensuring cart.js functions are global.