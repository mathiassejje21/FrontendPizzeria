import { html } from 'lit-html';

export function renderCarrousel() {
  return html`
    <style>
      .carousel-caption {
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.65),
          rgba(0, 0, 0, 0.25)
        );
        padding: 2rem 1.5rem;
        border-radius: 12px;
      }

      .carousel-caption h5 {
        font-size: 2.4rem;
        font-weight: 800;
        color: #FFC933;
        text-shadow: 0 3px 12px rgba(0, 0, 0, 0.8);
      }

      .carousel-caption p {
        font-size: 1.25rem;
        color: #FFFFFF;
        max-width: 700px;
        margin: 0 auto;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
      }

      .carousel-control-prev-icon,
      .carousel-control-next-icon {
        filter: drop-shadow(0px 0px 5px black);
      }
    </style>

    <div id="carouselExampleCaptions" class="carousel slide"
      style="box-shadow: 0 4px 10px 7px rgba(0, 0, 0, 0.25), 0 2px 4px 2px rgba(255, 255, 255, 0.3);"
      data-bs-ride="carousel" data-bs-interval="1000">

      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0"
          class="active" aria-current="true" aria-label="Slide 1"></button>

        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
          aria-label="Slide 2"></button>

        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
          aria-label="Slide 3"></button>

        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3"
          aria-label="Slide 4"></button>
      </div>

      <div class="carousel-inner">

        <!-- 1. PIZZA ARTESANAL -->
        <div class="carousel-item active" data-bs-interval="2000">
          <img src="https://cdn.pixabay.com/photo/2021/12/07/13/53/italian-cuisine-6853325_1280.jpg"
            class="d-block w-100"
            style="height: 100vh; object-fit: cover;" alt="Pizza artesanal">

          <div class="carousel-caption d-none d-md-block">
            <h5>El Sabor que Nace del Fuego</h5>
            <p>Pizza artesanal horneada a la piedra con masa fresca, ingredientes naturales
               y el toque auténtico que nos distingue.</p>
          </div>
        </div>

        <!-- 2. CHEF PREPARANDO LA MASA -->
        <div class="carousel-item" data-bs-interval="2000">
          <img src="https://cdn.pixabay.com/photo/2020/03/13/20/10/firangi-4929031_1280.jpg"
            class="d-block w-100"
            style="height: 100vh; object-fit: cover;" alt="Chef preparando pizza">

          <div class="carousel-caption d-none d-md-block">
            <h5>La Pasión Está en Cada Detalle</h5>
            <p>Nuestros chefs dan vida a cada receta con dedicación, técnica y un amor profundo por la cocina italiana.</p>
          </div>
        </div>

        <!-- 3. COMENSALES DISFRUTANDO -->
        <div class="carousel-item" data-bs-interval="2000">
          <img src="https://cdn.pixabay.com/photo/2016/11/21/16/02/outdoor-dining-1846137_1280.jpg"
            class="d-block w-100"
            style="height: 100vh; object-fit: cover;" alt="Clientes disfrutando">

          <div class="carousel-caption d-none d-md-block">
            <h5>Momentos que Saben Mejor Juntos</h5>
            <p>El lugar ideal para compartir, celebrar y crear recuerdos alrededor de una mesa llena de sabor y alegría.</p>
          </div>
        </div>

        <!-- 4. SERVICIO DELIVERY -->
        <div class="carousel-item" data-bs-interval="2000">
          <img src="https://cdn.pixabay.com/photo/2021/11/05/19/16/courier-6771892_1280.jpg"
            class="d-block w-100"
            style="height: 100vh; object-fit: cover;" alt="Delivery rápido">

          <div class="carousel-caption d-none d-md-block">
            <h5>Sabor que Llega Hasta Tu Puerta</h5>
            <p>Delivery rápido, seguro y siempre caliente, para que disfrutes tu pizza favorita sin esperar.</p>
          </div>
        </div>

      </div>

      <button class="carousel-control-prev" type="button"
        data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">

        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>

      <button class="carousel-control-next" type="button"
        data-bs-target="#carouselExampleCaptions" data-bs-slide="next">

        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>

    </div>
  `;
}
