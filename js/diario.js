document.addEventListener('DOMContentLoaded', () => {
    const journalContainer = document.getElementById('journal-container');

    if (!journalContainer) {
        console.error("ERRO: Container 'journal-container' não encontrado no HTML.");
        return;
    }

    journalContainer.innerHTML = '<div class="loader"></div>'; // Mostra o loader enquanto busca os dados

    fetch('https://gatonautas-backend.onrender.com/diario')
        .then(response => {
            if (!response.ok) {
                throw new Error(`A comunicação com a nave-mãe falhou: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            journalContainer.innerHTML = ''; // Limpa o loader

            if (!posts || posts.length === 0) {
                journalContainer.innerHTML = '<p>Nenhuma entrada no diário por enquanto. Estamos ocupados em uma missão secreta!</p>';
                return;
            }

            posts.forEach(post => {
                const postElement = document.createElement('article');
                postElement.classList.add('journal-entry');

                const postDate = new Date(post.data).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });

                //
                // A CORREÇÃO ESTÁ NESTE BLOCO: Note o uso da CRASE (`) no início e no fim.
                // Isso permite que tanto a imagem quanto o texto sejam processados corretamente.
                //
                postElement.innerHTML = `
                ${post.imagem_url ? `<img src="${post.imagem_url}" alt="${post.titulo}" class="journal-image">` : ''}
                <div class="journal-content">
                    <h2 class="journal-title">${post.titulo}</h2>
                    <p class="journal-meta">Por ${post.autor} em ${postDate}</p>
                    <p class="journal-body">${post.conteudo.replace(/\n/g, '<br>')}</p>
                </div>`;
                
                journalContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar entradas do diário:', error);
            journalContainer.innerHTML = '<p style="color:red;">Não foi possível carregar o Diário de Bordo. A comunicação com a nave foi cortada.</p>';
        });
});