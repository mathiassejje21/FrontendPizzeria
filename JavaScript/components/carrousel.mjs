import { html, render } from 'lit-html';

export function renderCarrousel () {
    return html `
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
            aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
            aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
            aria-label="Slide 3"></button>
        </div>

        <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="/public/images/pizza1.jpg" class="d-block w-100" style="height: 80vh; object-fit: cover;" alt="Pizza artesanal">
            <div class="carousel-caption d-none d-md-block">
            <h5>Sabores Artesanales</h5>
            <p>El auténtico sabor italiano con masa al horno de piedra.</p>
            </div>
        </div>
        <div class="carousel-item">
            <img src="/public/images/pizza2.jpg" class="d-block w-100" style="height: 80vh; object-fit: cover;" alt="Pizza familiar">
            <div class="carousel-caption d-none d-md-block">
            <h5>Comparte Momentos</h5>
            <p>Las mejores pizzas para disfrutar en familia o con amigos.</p>
            </div>
        </div>
        <div class="carousel-item">
            <img src="/public/images/pizza3.jpg" class="d-block w-100" style="height: 80vh; object-fit: cover;" alt="Pizza gourmet">
            <div class="carousel-caption d-none d-md-block">
            <h5>Experiencia Gourmet</h5>
            <p>Sabores únicos que elevan tu paladar.</p>
            </div>
        </div>
        </div>

        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
        </button>
    `;
}