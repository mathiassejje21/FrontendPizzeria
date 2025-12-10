import { html } from 'lit-html';

export function renderCarrousel() {
  return html`
    <style>
      .carousel-slide-img {
        width: 100%;
        height: 100vh;
        max-height: 900px;
        object-fit: cover;
      }

      .carousel-caption {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10%;
        width: 85%;
        max-width: 750px;
        padding: clamp(0.6rem, 2vw, 1.2rem) clamp(0.8rem, 3vw, 2rem);
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border-radius: 12px;
        text-align: center;
      }

      .carousel-caption h5 {
        font-size: clamp(1.2rem, 4vw, 2.3rem);
        font-weight: 800;
        color: #FFC933;
        margin-bottom: 0.4rem;
        text-shadow: 0 3px 10px rgba(0, 0, 0, 0.8);
      }

      .carousel-caption p {
        font-size: clamp(0.85rem, 2.3vw, 1.15rem);
        color: #fff !important;
        width: 95%;
        margin: 0 auto;
        line-height: 1.4;
        text-shadow: 0 2px 8px rgba(0,0,0,0.7);
      }

      .carousel-control-prev-icon,
      .carousel-control-next-icon {
        filter: drop-shadow(0px 0px 5px black);
        transform: scale(1.2);
      }
    </style>

    <div id="carouselExampleCaptions" class="carousel slide"
      style="width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.25);"
      data-bs-ride="carousel" data-bs-interval="3000">

      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3"></button>
      </div>

      <div class="carousel-inner">

        <div class="carousel-item active">
          <img src="https://cdn.pixabay.com/photo/2021/12/07/13/53/italian-cuisine-6853325_1280.jpg"
               class="carousel-slide-img"
               style="width: 100%; height: 100vh;">

          <div class="carousel-caption">
            <h5>El Sabor que Nace del Fuego</h5>
            <p>Pizza artesanal horneada a la piedra con ingredientes frescos y auténticos.</p>
          </div>
        </div>

        <div class="carousel-item">
          <img src="https://cdn.pixabay.com/photo/2020/03/13/20/10/firangi-4929031_1280.jpg"
               class="carousel-slide-img"
               style="width: 100%; height: 100vh;">

          <div class="carousel-caption">
            <h5>La Pasión Está en Cada Detalle</h5>
            <p>Nuestros chefs dan vida a cada receta con técnica y dedicación italiana.</p>
          </div>
        </div>

        <div class="carousel-item">
          <img src="https://cdn.pixabay.com/photo/2016/11/21/16/02/outdoor-dining-1846137_1280.jpg"
               class="carousel-slide-img"
               style="width: 100%; height: 100vh;">

          <div class="carousel-caption">
            <h5>Momentos que Saben Mejor Juntos</h5>
            <p>Un ambiente cálido para compartir y disfrutar con quienes más quieres.</p>
          </div>
        </div>

        <div class="carousel-item">
          <img src="https://cdn.pixabay.com/photo/2021/11/05/19/16/courier-6771892_1280.jpg"
               class="carousel-slide-img"
               style="width: 100%; height: 100vh;">

          <div class="carousel-caption">
            <h5>Sabor que Llega Hasta Tu Puerta</h5>
            <p>Delivery rápido, seguro y siempre caliente directo a tu casa.</p>
          </div>
        </div>

      </div>

      <button class="carousel-control-prev" type="button"
        data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>

      <button class="carousel-control-next" type="button"
        data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  `;
}
