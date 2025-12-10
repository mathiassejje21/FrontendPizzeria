import { html } from "lit-html";
import { renderCarrousel } from "@components/carrousel.mjs";
import { renderSugerencia } from "@components/sugerencia.mjs";
import { categoriaController } from "@controllers/categoriaController.mjs";

export async function mostrarInicio(user = null) {
    const api = new categoriaController();
    const categorias = await api.getCategorias();

    let sugerencias = html``;
    if (user && user.rol === "cliente") {
        sugerencias = await renderSugerencia();
    }

    return html`

<style>
body{
  background:linear-gradient(180deg,#1C1A18 0%,#2A2724 40%,#1C1A18 100%);
  color:#FFEEDB;
  font-family:"Trebuchet MS",sans-serif;
}

.contenedor-inicio{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:3rem;
  padding:4rem 1rem;
  flex-wrap:wrap;
}

.subtitle{
  font-size:3rem;
  font-weight:900;
  color:#FFC933;
  text-shadow:0 4px 14px rgba(0,0,0,0.5);
  text-align:center;
}

.description{
  font-size:1.2rem;
  color:#FFEEDB;
  text-align:center;
  max-width:750px;
  margin:0 auto;
  line-height:1.7;
}

.logo-inicio{
  height:220px;
  width:220px;
  border-radius:50%;
  padding:12px;
  object-fit:cover;
  background:rgba(255,255,255,0.15);
  backdrop-filter:blur(6px);
  box-shadow:0 8px 25px rgba(0,0,0,0.4);
}

.cantenedo-categoria{
  padding:3rem 8%;
  background:#1C1A18;
}

.cantenedo-categoria h2{
  color:#FFC933;
  text-shadow:0 3px 10px rgba(0,0,0,0.4);
}

.cantenedo-categoria p{
  color:#FFEEDB;
}

.categoria-card{
  width:100%;
  position:relative;
  margin-top:6rem;
  background:rgba(255,243,222,0.08);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:14px;
  padding-bottom:1.5rem;
  backdrop-filter:blur(8px);
  transition:.3s;
}

.categoria-card:hover{
  transform:translateY(-6px);
  box-shadow:0 8px 25px rgba(0,0,0,0.3);
}

.categoria-img{
  position:absolute;
  top:-100px;
  left:50%;
  transform:translateX(-50%);
  width:210px;
  height:140px;
  object-fit:cover;
  border-radius:12px;
  box-shadow:0 8px 18px rgba(0,0,0,0.4);
}

.categoria-card h5{
  margin-top:3.5rem;
  font-size:1.3rem;
  color:#FFC933;
  font-weight:800;
  text-align:center;
}

.categoria-card small{
  color:#FFEEDB;
}

.card{
  background:#26221F;
  color:#FFEEDB;
  border-radius:16px;
  border:1px solid rgba(255,255,255,0.12);
  transition:.3s;
}

.card:hover{
  transform:translateY(-8px);
  box-shadow:0 10px 25px rgba(0,0,0,0.3);
}

.feature-icon{
  font-size:45px;
  color:#FFC933;
}

.about-section{
  background:#1F1C1A;
  padding:3rem 2rem;
  border-radius:18px;
}

.about-section h2{
  color:#FFC933;
}

.about-section p{
  color:#FFEEDB;
  font-size:1.1rem;
  line-height:1.7;
}

.philosophy{
  background:#26221F;
  text-align:center;
  padding:4rem 2rem;
  border-top:2px solid rgba(255,255,255,0.1);
}

.philosophy h2{
  color:#FFC933;
  font-size:2rem;
}

.philosophy p{
  max-width:850px;
  margin:1.5rem auto;
  color:#FFEEDB;
  font-size:1.15rem;
}

.contact-section{
  background:#151412;
  padding:4rem 2rem;
  text-align:center;
  border-top:2px solid rgba(255,255,255,0.15);
}

.contact-title{
  font-size:2.2rem;
  font-weight:900;
  color:#FFC933;
  margin-bottom:1.2rem;
  text-shadow:0 3px 10px rgba(0,0,0,0.5);
}

.contact-info{
  max-width:850px;
  margin:0 auto;
  color:#FFEEDB;
  font-size:1.15rem;
  line-height:1.7;
}

.contact-grid{
  display:flex;
  justify-content:center;
  gap:3rem;
  margin-top:2rem;
  flex-wrap:wrap;
}

.contact-box{
  background:#1F1C1A;
  padding:1.8rem 2rem;
  border-radius:12px;
  border:1px solid rgba(255,255,255,0.1);
  width:280px;
  text-align:center;
}

.contact-box h4{
  color:#FFC933;
  font-size:1.3rem;
  font-weight:800;
  margin-bottom:.8rem;
}

.contact-box p{
  color:#FFEEDB;
  font-size:1rem;
}

.footer{
  background:#000;
  color:#FFC933;
  padding:2rem 1rem;
  text-align:center;
  font-weight:700;
  font-size:1.2rem;
  letter-spacing:1px;
  border-top:3px solid #FFC933;
}

@media(max-width:768px){
  .contenedor-inicio{
    flex-direction:column;
    text-align:center;
  }
  .subtitle{
    font-size:2.3rem;
  }
  .description{
    font-size:1rem;
  }
  .categoria-img{
    width:160px;
    height:110px;
    top:-50px;
  }
  .categoria-card{
    margin-top:5rem;
  }
  .contact-grid{
    flex-direction:column;
    gap:1.5rem;
  }
  .contact-box{
    width:100%;
  }

  p{
    color:#fff !important;
  }
}
</style>

${renderCarrousel()}
${sugerencias}

<section class="contenedor-inicio">
  <img src="https://cdn.pixabay.com/photo/2024/03/29/19/47/ai-generated-8663536_1280.png" class="logo-inicio">
  <div style="max-width:750px;">
    <h1 class="subtitle">¡Bienvenido a Pizzería Don Mario!</h1>
    <p class="description">
      La tradición italiana llega a tu mesa con el sabor único de nuestras pizzas artesanales.
      Ingredientes seleccionados, masa fresca y el amor por la cocina que nos caracteriza.
    </p>
  </div>
</section>

<section style="height:3px;background:#FFC933;width:80%;margin:0.5rem auto;border-radius:3px;"></section>

<section class="cantenedo-categoria">
  <div class="text-center mb-5">
    <h2 class="fw-bold">Brindamos las mejores categorías en productos</h2>
    <p>Explora nuestras categorías disponibles.</p>
  </div>
  <div class="row row-cols-1 row-cols-md-3 g-5">
    ${categorias.map(c => html`
      <a href="/pizzeria/productos" data-route class="col" style="text-decoration:none;cursor:pointer;">
        <div class="categoria-card">
          <img src="${c.imagen_url}" class="categoria-img">
          <div style="padding-top:3%;">
            <h5>${c.nombre}</h5>
            <div style="text-align:center;">
              <small>${c.descripcion}</small>
            </div>
          </div>
        </div>
      </a>
    `)}
  </div>
</section>

<section style="height:3px;background:#3FAF52;width:80%;margin:0.5rem auto;border-radius:3px;"></section>

<section class="container my-5">
  <div class="text-center mb-5">
    <h2 class="fw-bold" style="color:#FFC933;">🍽️ Nuestras Especialidades</h2>
  </div>
  <div class="row g-4 justify-content-center">
    <div class="col-md-4 col-sm-6">
      <div class="card text-center p-3">
        <div class="feature-icon mb-3">🔥</div>
        <div class="card-body">
          <h5 class="card-title">Pizza Don Warrion</h5>
          <p class="card-text">Salsa secreta, mozzarella y peperoni ahumado.</p>
        </div>
      </div>
    </div>
    <div class="col-md-4 col-sm-6">
      <div class="card text-center p-3">
        <div class="feature-icon mb-3">🌿</div>
        <div class="card-body">
          <h5 class="card-title">Pizza Vegetariana</h5>
          <p class="card-text">Champiñones, pimientos y aceitunas frescas.</p>
        </div>
      </div>
    </div>
    <div class="col-md-4 col-sm-6">
      <div class="card text-center p-3">
        <div class="feature-icon mb-3">🧀</div>
        <div class="card-body">
          <h5 class="card-title">Pizza Cuatro Quesos</h5>
          <p class="card-text">Mozzarella, gorgonzola, parmesano y cheddar fundido.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="about-section container my-5">
  <div class="row align-items-center">
    <div class="col-md-6">
      <img src="https://cdn.pixabay.com/photo/2025/07/02/11/58/ai-generated-9692232_1280.png" class="img-fluid">
    </div>
    <div class="col-md-6">
      <h2>Sobre Nosotros</h2>
      <p>
        En Don Mario creemos que una pizza no es solo comida: es una experiencia.
        Cada receta nace de nuestra pasión por la tradición italiana y del compromiso por ofrecer productos frescos y de calidad.

        Trabajamos diariamente con masa artesanal, ingredientes seleccionados y cocciones precisas, logrando sabores que conectan con quienes nos visitan.
        Somos un equipo tacneño que ama lo que hace… y queremos que cada cliente lo sienta en cada bocado
      </p>
    </div>
  </div>
</section>

<section class="philosophy">
  <h2>Más que pizza, compartimos momentos</h2>
  <p>
    En Don Warrion cada mesa es una experiencia. No solo cocinamos pizza: creamos recuerdos.
  </p>
</section>

<section class="contact-section">
  <h2 class="contact-title">Contacto y Ubicación</h2>
  <p class="contact-info">
    Estamos ubicados en la ciudad de Tacna, ofreciendo delivery, recojo en tienda y atención en salón.
    Nuestro equipo está listo para atenderte con la mejor experiencia gastronómica.
  </p>

  <div class="contact-grid">
    <div class="contact-box">
      <h4>📍 Dirección</h4>
      <p>Av. Bolognesi 1234 — Tacna, Perú</p>
    </div>

    <div class="contact-box">
      <h4>📞 Teléfono</h4>
      <p>+51 952 436 789</p>
    </div>

    <div class="contact-box">
      <h4>⏰ Horario</h4>
      <p>Lunes a Domingo<br>12:00 pm — 11:00 pm</p>
    </div>
  </div>
</section>

<div class="footer">
  ❤️ Hecho con pasión, sabor y tradición — Don Mario 🍕
</div>

`;
}
