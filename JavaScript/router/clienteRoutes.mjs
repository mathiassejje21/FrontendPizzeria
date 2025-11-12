import { renderDashboardView } from "@views/cliente/dashboard.mjs";
import { renderHomeView } from '@views/cliente/home.mjs'

export const clienteRoutes = (router) => {
  router.on("/pizzeria", () => {renderHomeView('home')});
  router.on("/pizzeria/productos", () => {renderHomeView('productos')});
  router.on("/pizzeria/dashboard", renderDashboardView);
};
