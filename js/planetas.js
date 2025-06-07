document.addEventListener('DOMContentLoaded', () => {
    const planetListContainer = document.getElementById('planet-list-container');
    const starMapContainer = document.getElementById('star-map-container');
    const planetDetailsDisplay = document.getElementById('planet-details-display');
    let allPlanetsData = []; 

    if (!planetListContainer || !starMapContainer || !planetDetailsDisplay) {
        console.error("Elementos essenciais da página de planetas não encontrados!");
        if(planetListContainer) planetListContainer.innerHTML = '<p style="color:red;">Erro ao carregar componentes da página.</p>';
        return;
    }

    // Não precisa de loader aqui se já está no HTML
    // planetListContainer.innerHTML = '<div class="loader"></div>';

    fetch('https://gatonautas-backend.onrender.com/planetas') // Ajuste se sua URL do backend for diferente
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(planetas => {
            allPlanetsData = planetas;
            planetListContainer.innerHTML = ''; 
            
            // Limpa marcadores antigos, exceto o fundo.
            const existingMarkers = starMapContainer.querySelectorAll('.star-map-planet');
            existingMarkers.forEach(marker => marker.remove());

            if (!planetas || planetas.length === 0) {
                planetListContainer.innerHTML = '<p>Nenhum planeta visitado registrado ainda. A Gaton IX está em missão!</p>';
                return;
            }

            planetas.forEach((planeta, index) => {
                const planetCard = document.createElement('article');
                planetCard.classList.add('planet-card');
                planetCard.innerHTML = `
                    <img src="${planeta.imagem_geral || 'materiais/placeholder_planeta.jpg'}" alt="Visão geral de ${planeta.nome}" class="planet-image-geral">
                    <h3>${planeta.nome}</h3>
                    <p class="planet-coords">Coordenadas: ${planeta.coordenadas || 'Desconhecidas'}</p>
                    <p class="planet-short-desc">${planeta.descricao_curta || 'Em breve mais detalhes desta missão!'}</p>
                    <button class="btn-details" data-planetid="${planeta.id}">Ver Transformação</button>
                    <div class="transformation-details" id="details-${planeta.id}" style="display:none;">
                        <h4>Transformação de ${planeta.nome}:</h4>
                        <div class="transform-comparison">
                            <div class="transform-state">
                                <h5>Antes</h5>
                                <img src="${planeta.imagem_antes || 'materiais/placeholder_antes.jpg'}" alt="Planeta ${planeta.nome} antes">
                                <p>${planeta.status_antes || 'Dados não registrados.'}</p>
                            </div>
                            <div class="transform-state">
                                <h5>Depois</h5>
                                <img src="${planeta.imagem_depois || 'materiais/placeholder_depois.jpg'}" alt="Planeta ${planeta.nome} depois">
                                <p>${planeta.status_depois || 'Transformação em andamento!'}</p>
                            </div>
                        </div>
                        <p><small>Data da Transformação: ${planeta.data_transformacao ? new Date(planeta.data_transformacao).toLocaleDateString('pt-BR') : 'Em breve'}</small></p>
                    </div>
                `;
                planetListContainer.appendChild(planetCard);

                const starMarker = document.createElement('div');
                starMarker.classList.add('star-map-planet');
                starMarker.title = planeta.nome;
                // Posições pseudo-aleatórias para exemplo, idealmente viriam do backend ou teriam lógica mais elaborada
                starMarker.style.left = `${(index * 10 + 5 + Math.random()*10)}%`; 
                starMarker.style.top = `${(15 + Math.random() * 70)}%`;
                starMarker.dataset.planetid = planeta.id;
                starMarker.textContent = '✦'; // Um ícone de estrela/planeta
                starMapContainer.appendChild(starMarker);

                starMarker.addEventListener('click', () => {
                    displayPlanetDetails(planeta.id);
                    planetDetailsDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });

            document.querySelectorAll('.btn-details').forEach(button => {
                button.addEventListener('click', (e) => {
                    const planetId = parseInt(e.target.dataset.planetid);
                    const detailsDiv = document.getElementById(`details-${planetId}`);
                    if (detailsDiv) {
                        const isDisplayed = detailsDiv.style.display === 'block';
                        detailsDiv.style.display = isDisplayed ? 'none' : 'block';
                        if (!isDisplayed) {
                           displayPlanetDetails(planetId); // Atualiza a área de destaque também
                           planetDetailsDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            planetDetailsDisplay.style.display = 'none'; // Esconde a área de destaque se o card for fechado
                        }
                    }
                });
            });

        })
        .catch(error => {
            console.error('Falha ao buscar planetas:', error);
            planetListContainer.innerHTML = `<p style="color: red;">Oops! Não conseguimos carregar os dados dos planetas. Detalhe: ${error.message}</p>`;
        });

    function displayPlanetDetails(planetId) {
        const planeta = allPlanetsData.find(p => p.id === planetId);
        if (!planeta) {
            planetDetailsDisplay.innerHTML = '<p>Detalhes não encontrados para este planeta.</p>';
            planetDetailsDisplay.style.display = 'block';
            return;
        }

        planetDetailsDisplay.innerHTML = `
            <h2>${planeta.nome}</h2>
            <p><strong>Coordenadas:</strong> ${planeta.coordenadas || 'Desconhecidas'}</p>
            <img src="${planeta.imagem_geral || 'materiais/placeholder_planeta.jpg'}" alt="Visão geral de ${planeta.nome}" style="max-width: 100%; border-radius: 8px; margin-bottom: 1rem;">
            <p>${planeta.descricao_curta || 'Em breve mais detalhes desta missão!'}</p>
            <h3>Detalhes da Transformação:</h3>
            <div class="transform-comparison" style="display: flex; justify-content: space-around; text-align: center; flex-wrap: wrap;">
                <div class="transform-state" style="flex: 1; padding: 10px; min-width: 250px;">
                    <h4>Antes da Missão Gatonauta</h4>
                    <img src="${planeta.imagem_antes || 'materiais/placeholder_antes.jpg'}" alt="Planeta ${planeta.nome} antes" style="width: 100%; height: auto; max-height:200px; object-fit:cover; border-radius: 8px;">
                    <p>${planeta.status_antes || 'Dados não registrados.'}</p>
                </div>
                <div class="transform-state" style="flex: 1; padding: 10px; min-width: 250px;">
                    <h4>Depois da Missão Gatonauta</h4>
                    <img src="${planeta.imagem_depois || 'materiais/placeholder_depois.jpg'}" alt="Planeta ${planeta.nome} depois" style="width: 100%; height: auto; max-height:200px; object-fit:cover; border-radius: 8px;">
                    <p>${planeta.status_depois || 'Transformação em andamento!'}</p>
                </div>
            </div>
            <p style="text-align:center; margin-top:1rem;"><small>Data da Transformação: ${planeta.data_transformacao ? new Date(planeta.data_transformacao).toLocaleDateString('pt-BR') : 'Em breve'}</small></p>
            <button id="closeDetailsBtn" class="btn-secondary" style="margin-top:1rem;">Fechar Detalhes</button>
        `;
        planetDetailsDisplay.style.display = 'block';

        document.getElementById('closeDetailsBtn').addEventListener('click', () => {
            planetDetailsDisplay.style.display = 'none';
        });
    }
});