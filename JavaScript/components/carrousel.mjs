import { html } from 'lit-html';

export function renderCarrousel() {
  return html`
    <div id="carouselExampleCaptions" class="carousel slide" style="box-shadow: 0 4px 10px 7px rgba(0, 0, 0, 0.25),
                  0 2px 4px 2px rgba(255, 255, 255, 0.3); data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
          aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
          aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
          aria-label="Slide 3"></button>
      </div>

      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="3000">
          <img src="/public/images/carrousel1.jpg"
            class="d-block w-100"
            style="height: 60vh; object-fit: cover;"
            alt="Pizza artesanal">
          <div class="carousel-caption d-none d-md-block">
            <h5>Pizza Artesanal al Horno de Piedra</h5>
            <p>Preparada con ingredientes frescos y masa elaborada a mano para un sabor auténtico italiano.</p>
          </div>
        </div>

        <div class="carousel-item" data-bs-interval="3000">
          <img src="/public/images/carrousel2.jpg"
            class="d-block w-100"
            style="height: 60vh; object-fit: cover;"
            alt="Ambiente familiar">
          <div class="carousel-caption d-none d-md-block">
            <h5>Un Espacio Familiar y Acogedor</h5>
            <p>Disfruta de tus comidas favoritas con el mejor ambiente y atención personalizada.</p>
          </div>
        </div>

        <div class="carousel-item" data-bs-interval="3000">
          <img src="/public/images/carrousel3.jpg"
            class="d-block w-100"
            style="height: 60vh; object-fit: cover;"
            alt="Promociones exclusivas">
          <div class="carousel-caption d-none d-md-block">
            <h5>Promociones que No Puedes Perder</h5>
            <p>Ofertas especiales cada fin de semana en pizzas, pastas y bebidas artesanales.</p>
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
    </div>
  `;
}
