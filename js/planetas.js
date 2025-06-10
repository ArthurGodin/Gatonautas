document.addEventListener('DOMContentLoaded', () => {
    const planetListContainer = document.getElementById('planet-list-container');
    const starMapContainer = document.getElementById('star-map-container');

    if (!planetListContainer || !starMapContainer) {
        console.error("ERRO: O container da lista de planetas ou do mapa estelar não foi encontrado!");
        if (planetListContainer) {
            planetListContainer.innerHTML = '<p style="color:red;">Erro ao carregar componentes da página.</p>';
        }
        return;
    }

    fetch('https://gatonautas-backend.onrender.com/planetas')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(planetas => {
            planetListContainer.innerHTML = ''; // Limpa o loader

            if (!planetas || planetas.length === 0) {
                planetListContainer.innerHTML = '<p>Nenhum planeta visitado registrado ainda. A Gaton IX está em missão!</p>';
                return;
            }

            planetas.forEach((planeta) => {
                // Cria o card do planeta na lista
                const planetCard = document.createElement('article');
                planetCard.classList.add('planet-card');
                planetCard.id = `planet-card-${planeta.id}`;
                planetCard.innerHTML = `
                    <img src="${planeta.imagem_geral || 'materiais/placeholder_planeta.jpg'}" alt="Visão geral de ${planeta.nome}" class="planet-image-geral">
                    <h3>${planeta.nome}</h3>
                    <p class="planet-coords">Coordenadas: ${planeta.coordenadas || 'Desconhecidas'}</p>
                    <p class="planet-short-desc">${planeta.descricao_curta || 'Em breve mais detalhes desta missão!'}</p>
                    <button class="btn-details" data-planetid="${planeta.id}">Ver Transformação</button>
                    <div class="transformation-details" id="details-${planeta.id}" style="display:none;">
                        <h4>Transformação de ${planeta.nome}:</h4>
                        <div class="comparison-slider" data-slider-id="${planeta.id}">
                            <div class="image-before">
                                <img src="${planeta.imagem_antes || 'materiais/placeholder_antes.jpg'}" alt="Planeta ${planeta.nome} antes">
                            </div>
                            <img src="${planeta.imagem_depois || 'materiais/placeholder_depois.jpg'}" alt="Planeta ${planeta.nome} depois">
                            <div class="slider-handle"></div>
                        </div>
                        <p><small>Data da Transformação: ${planeta.data_transformacao ? new Date(planeta.data_transformacao).toLocaleDateString('pt-BR') : 'Em breve'}</small></p>
                    </div>
                `;
                planetListContainer.appendChild(planetCard);

                // Cria o marcador no mapa estelar
                const starMarker = document.createElement('div');
                starMarker.classList.add('star-map-planet');
                starMarker.title = planeta.nome;
                starMarker.textContent = '✦'; // <<< LINHA CORRIGIDA/ADICIONADA!
                starMarker.style.left = planeta.mapa_x || '50%';
                starMarker.style.top = planeta.mapa_y || '50%';

                starMarker.addEventListener('click', () => {
                    const targetCard = document.getElementById(`planet-card-${planeta.id}`);
                    if (targetCard) {
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetCard.classList.add('highlight');
                        setTimeout(() => {
                            targetCard.classList.remove('highlight');
                        }, 2000);
                    }
                });
                starMapContainer.appendChild(starMarker);
            });

            // Inicializa todos os sliders de comparação de imagem
            initComparisonSliders();

            // Adiciona um único event listener para todos os botões "Ver Transformação"
            planetListContainer.addEventListener('click', function (e) {
                if (e.target && e.target.classList.contains('btn-details')) {
                    const planetId = e.target.dataset.planetid;
                    const detailsDiv = document.getElementById(`details-${planetId}`);
                    if (detailsDiv) {
                        const isDisplayed = detailsDiv.style.display === 'block';
                        detailsDiv.style.display = isDisplayed ? 'none' : 'block';
                        e.target.textContent = isDisplayed ? 'Ver Transformação' : 'Ocultar Transformação';
                    }
                }
            });
        })
        .catch(error => {
            console.error('ERRO CRÍTICO AO BUSCAR PLANETAS:', error);
            planetListContainer.innerHTML = `<p style="color: red; font-weight: bold;">Oops! Falha na comunicação com a nave-mãe.<br><small>Detalhe técnico: ${error.message}</small></p>`;
        });
});

/**
 * Função para inicializar todos os sliders de comparação de imagens na página.
 */
function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const imageBefore = slider.querySelector('.image-before');
        let isDragging = false;

        function moveSlider(x) {
            const rect = slider.getBoundingClientRect();
            let newWidth = ((x - rect.left) / rect.width) * 100;
            if (newWidth < 0) newWidth = 0;
            if (newWidth > 100) newWidth = 100;
            imageBefore.style.width = newWidth + '%';
            handle.style.left = newWidth + '%';
        }

        // Eventos de Mouse
        handle.addEventListener('mousedown', () => { isDragging = true; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });

        // Eventos de Toque (para dispositivos móveis)
        handle.addEventListener('touchstart', () => { isDragging = true; });
        document.addEventListener('touchend', () => { isDragging = false; });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                // Impede o scroll da página enquanto arrasta o slider
                e.preventDefault(); 
                moveSlider(e.touches[0].clientX);
            }
        }, { passive: false }); // passive: false é necessário para o preventDefault funcionar
    });
}