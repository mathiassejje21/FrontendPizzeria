import { renderDashboardView } from "@views/cliente/dashboard.mjs";
import { renderHomeView } from '@views/cliente/home.mjs'
import { mostrarDetalleProducto } from '@views/cliente/detalleProducto.mjs'

export const clienteRoutes = (router) => {
  router.on("/pizzeria", () => {renderHomeView('home')});
  router.on("/pizzeria/productos", () => {renderHomeView('productos')});
  router.on("/pizzeria/dashboard", () => {renderDashboardView()});
  router.on("/pizzeria/productos/:id", ({ data }) => {
    mostrarDetalleProducto(data.id);
  });
  router.on("/pizzeria/carrito", () => {renderHomeView('carrito')});
}
