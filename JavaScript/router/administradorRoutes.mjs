import { renderDashboardView } from "@views/administrador/dashboard.mjs";
import { renderHomeView } from '@views/administrador/home.mjs'
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";

export const administradorRoutes = (router) => {
  router.on("/administrador/home", async() => {
    const session = await validateSession(["administrador"]);
    if (!session.ok) return handleUnauthorized(session);
    renderHomeView(session.user);
  });
  router.on('/administrador/dashboard', () => { renderDashboardView(); });

  router.on('/administrador/pedidos', () => {});

  router.on('/administrador/gestion', () => {});
};
