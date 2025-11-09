import { renderDashboardView } from "@views/personal/dashboard.mjs";

export function personalRoutes(router) {
    router.on('/personal/dashboard', () => { renderDashboardView(); });

    router.on('/personal/pedidos', () => {});

    router.on('/personal/perfil', () => {});
}
