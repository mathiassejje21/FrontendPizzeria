import { html, render } from "lit-html";
import { renderCarrousel } from "@components/carrousel.mjs";
import { renderSugerencia } from "@components/sugerencia.mjs";
import { categoriaController } from "@controllers/categoriaController.mjs";

export async function mostrarInicio( user = null ) {
    const api = new categoriaController();
    const categorias = await api.getCategorias();

    let sugerencias = html``;
    if (user && user.rol === "cliente") {
        sugerencias = await renderSugerencia();
    }

    return html`
    <style>
        .subtitle {
          padding: rem 0 1rem;
          color: #0a3a17;
          font-size: 42px;
          font-weight: 800;
          text-align: center;
          font-family: 'Trebuchet MS';
        }

        .description {
          text-align: center;
          color: #333;
          font-size: 20px;
          margin: 0 auto 3rem;
          max-width: 850px;
          line-height: 1.6;
        }

        .feature-icon {
          font-size: 45px;
          color: #ffd366;
        }

        .card {
          border: none;
          border-radius: 16px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .card-body h5 {
          color: #0a3a17;
          font-weight: 700;
        }


        .philosophy {
          background-color: #efefef;
          text-align: center;
          padding: 4rem 2rem;
        }

        .philosophy h2 {
          color: #0a3a17;
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .philosophy p {
          max-width: 900px;
          margin: 0 auto;
          color: #333;
          font-size: 18px;
        }

        .footer-banner {
          background-color: #000;
          color: #ffd366;
          text-align: center;
          padding: 2rem 1rem;
          font-weight: 600;
          font-size: 20px;
          letter-spacing: 1px;
        }
      </style>
      ${renderCarrousel()}
      ${sugerencias} 

      <div>
        <img src="https://cdn.pixabay.com/photo/2024/03/29/19/47/ai-generated-8663536_1280.png" alt="Logo de la pizzeria" class="mx-auto d-block" height="200" width="200">
        <h1 class="subtitle">¡Bienvenido a Pizzería Don Mario!</h1>
      </div>
      <p class="description">
        La tradición italiana llega a tu mesa con el sabor único de nuestras pizzas artesanales.  
        Ingredientes seleccionados, masa fresca y el amor por la cocina que nos caracteriza.
      </p>
      
      <section style="background-color: #656565ff; width: 80%; margin: 0.2rem auto; padding: 0.02rem; display: flex; align-items: center;"></section>

      <section class="categorias-section container my-5">
        <div class="text-center mb-5">
          <h2 class="fw-bold" style="color:#0a3a17;">Brindamos las mejores categorias en productos</h2>
          <p>Explora nuestras categorias de los productos disponibles.</p>
        </div>
        <div class="row row-cols-1 row-cols-md-3 g-4">
        ${categorias.map(categoria => html`
          <a href="/pizzeria/productos" 
            data-route 
            style="text-decoration: none; cursor: pointer;" 
            class="col">

            <div style="position: relative; margin-top: 7rem;">

              <img 
                src="${categoria.imagen_url}" 
                alt="..."
                style="
                  position: absolute;
                  top: -100px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 220px;
                  height: 150px;
                  object-fit: cover;
                  z-index: 1;
                "
              >

              <div class="card h-100" style="padding-top: 3rem; border-radius: 18px;">
                <div class="card-body">
                  <h5 class="card-title fw-bold" style="text-align: center;">${categoria.nombre}</h5>
                </div>

                <div class="card-footer" style="text-align: center;">
                  <small class="text-body-primary font-weight-bold">${categoria.descripcion}</small>
                </div>
              </div>

            </div>
          </a>
        `)}
      </section>

      <section style="background-color: #656565ff; width: 80%; margin: 0.2rem auto; padding: 0.02rem; display: flex; align-items: center;"></section>

      <section class="container my-5">
        <div class="text-center mb-5">
          <h2 class="fw-bold" style="color:#0a3a17;">🍽️ Nuestras Especialidades</h2>
          <p>Descubre los sabores más pedidos por nuestros clientes.</p>
        </div>
        <div class="row g-4 justify-content-center">
          <div class="col-md-4 col-sm-6">
            <div class="card text-center p-3">
              <div class="feature-icon mb-3">🔥</div>
              <div class="card-body">
                <h5 class="card-title">Pizza Don Warrion</h5>
                <p class="card-text">La favorita: salsa secreta, mozzarella y toque de peperoni ahumado.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-6">
            <div class="card text-center p-3">
              <div class="feature-icon mb-3">🌿</div>
              <div class="card-body">
                <h5 class="card-title">Pizza Vegetariana</h5>
                <p class="card-text">Una explosión de sabores frescos: champiñones, pimientos y aceitunas.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-6">
            <div class="card text-center p-3">
              <div class="feature-icon mb-3">🧀</div>
              <div class="card-body">
                <h5 class="card-title">Pizza Cuatro Quesos</h5>
                <p class="card-text">Mozzarella, gorgonzola, parmesano y cheddar derretido sobre una masa crujiente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section container my-5">
        <div class="row align-items-center">
          <div class="col-md-6">
            <img src="https://cdn.pixabay.com/photo/2025/07/02/11/58/ai-generated-9692232_1280.png" alt="Sobre nosotros" class="img-fluid">
          </div>
          <div class="col-md-6">  
            <h2>Sobre Nosotros</h2>
            <p>
              Nuestra historia comienza con la pasión por la cocina italiana.  
              Nuestro equipo de chefs expertos se encarga de preparar pizzas artesanales con ingredientes frescos y sabores irresistibles.  
              Desde la masa crujiente hasta la salsa secreta, cada ingrediente es cuidadosamente seleccionado para ofrecerte una experiencia culinaria unica.  
              En Don Warrion, nos dedicamos a ofrecer pizzas que no solo son deliciosas, sino que tambien son momentos inolvidables.
            </p>
          </div>
        </div>
        
      </section>
      <section class="philosophy">
        <h2>Más que pizza, compartimos momentos</h2>
        <p>
          En Don Warrion, cada mesa es una historia. Cada sonrisa, una recompensa.  
          Nuestro compromiso no es solo ofrecerte comida deliciosa, sino hacerte sentir parte de nuestra familia.  
          Ven, relájate y deja que el aroma del horno te recuerde lo que realmente importa:  
          disfrutar los pequeños placeres de la vida.
        </p>
      </section>

      <div class="footer-banner"">
        ❤️ Hecho con pasión, sabor y tradición — Don Warrion 🍕
      </div>
    `;
}