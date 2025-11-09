import { html, render } from 'lit-html';
import { getProductos } from '@/controllers/productoController.mjs';

export async function renderHomeView() {
    const template = html`
<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#inicio" style="display: flex;">
      <img src="/public/images/logo-pizza.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top me-2">
      <h4 class="m-0 p-0 fw-bold text-danger">Pizzeria</h4>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
      <form class="d-flex me-3">
        <input class="form-control me-2" type="search" placeholder="Buscar pizzas..." aria-label="Buscar">
        <button class="btn btn-outline-success" type="submit">Buscar</button>
      </form>

      <ul class="navbar-nav mx-auto">
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="#inicio">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="#productos">Productos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link fw-semibold" href="#contacto">Contacto</a>
        </li>
      </ul>

      <a href="/pizzeria/login" class="btn btn-outline-success d-flex align-items-center">
        <img src="/public/images/logo-admin.png" alt="Logo" width="25" height="25" class="me-2">
        Iniciar Sesión
      </a>
    </div>
  </div>
</nav>

<section style="position: absolute; top: 3rem; left: 0; width: 100%;" id="inicio">
  <div class="text-center py-3 bg-light">
    <h2 class="fw-bold text-success m-0">Bienvenido a Pizza Don Luigui 🍕</h2>
  </div>

  <div id="carouselExampleCaptions" class="carousel slide mb-5">
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
  </div>

  <div id = "productos" class="text-center py-3 bg-light">
  </div>
  <section class="container">
    <h2 class="text-center text-success fw-bold">Nuestros Productos</h2>
    

<div class="container py-4" id="productos">
 <!-- 🔘 Botones de categorías -->
  <div class="text-center mb-4">
    <button class="btn btn-outline-danger mx-2 active" onclick="mostrarCategoria(1)">Pizzas</button>
    <button class="btn btn-outline-primary mx-2" onclick="mostrarCategoria(2)">Bebidas</button>
    <button class="btn btn-outline-warning mx-2" onclick="mostrarCategoria(3)">Postres</button>
  </div>

  <!-- 🍕 PIZZAS -->
  <div class="categoria categoria-1">
    <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col">
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <img src="/public/images/pizza1.jpg" class="card-img-top" alt="<?= htmlspecialchars($producto['nombre']) ?>">
              <div class="card-body text-center">
                <h5 class="card-title fw-bold"><?= htmlspecialchars($producto['nombre']) ?></h5>
                <p class="card-text text-muted small"><?= htmlspecialchars($producto['descripcion']) ?></p>
                <span class="badge bg-success fs-6">$<?= number_format($producto['precio'], 2) ?></span>
              </div>
            </div>
          </div>
    </div>
  </div>

  <!-- 🥤 BEBIDAS -->
  <div class="categoria categoria-2 d-none">
    <div class="row row-cols-1 row-cols-md-4 g-4">
          <div class="col">
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden" style="height: 360px;">
              <img src="/public/images/bebida.jpg" class="card-img-top" alt="<?= htmlspecialchars($producto['nombre']) ?>" style="height: 200px; object-fit: cover;">
              <div class="card-body text-center d-flex flex-column justify-content-between">
                <div>
                  <h5 class="card-title fw-bold"><?= htmlspecialchars($producto['nombre']) ?></h5>
                  <p class="card-text text-muted small"><?= htmlspecialchars($producto['descripcion']) ?></p>
                </div>
                <span class="badge bg-success fs-6 mt-2">$<?= number_format($producto['precio'], 2) ?></span>
              </div>
            </div>
          </div>
    </div>
  </div>

  <!-- 🍰 POSTRES -->
  <div class="categoria categoria-3 d-none">
    <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col">
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <img src="/public/images/postre.jpg" class="card-img-top" alt="<?= htmlspecialchars($producto['nombre']) ?>">
              <div class="card-body text-center">
                <h5 class="card-title fw-bold"><?= htmlspecialchars($producto['nombre']) ?></h5>
                <p class="card-text text-muted small"><?= htmlspecialchars($producto['descripcion']) ?></p>
                <span class="badge bg-success fs-6">$<?= number_format($producto['precio'], 2) ?></span>
              </div>
            </div>
          </div>
    </div>
  </div>

</div>

 <!-- Contacto -->
  <section id="contacto" class="bg-light py-5">
    <div class="container text-center">
      <h2>📞 Contáctanos</h2>
      <p class="mb-0">Visítanos o llámanos para tus pedidos especiales.</p>
    </div>
  </section>
</section>
    `;
    render(template, document.getElementById('main'))
    
    const res = await getProductos();
    const productos = Array.from(res); 
    console.log(productos);
    
    const templates = html`
    <div class="row row-cols-1 row-cols-md-3 g-4">
      ${productos.map(
        producto => html`
          <div class="col">
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <img src="/public/images/pizza1.jpg" class="card-img-top" alt="">
              <div class="card-body text-center">
                <h5 class="card-title fw-bold">${producto.nombre}</h5>
                <p class="card-text text-muted small">${producto.descripcion}</p>
                <span class="badge bg-success fs-6">$${producto.precio}</span>
              </div>
            </div>
          </div>
        `
      )}
    </div>
  `;
    render(templates, document.getElementById('productos'));

}
