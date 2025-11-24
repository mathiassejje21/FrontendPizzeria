import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { clearSession } from "@/service/session.mjs";

export async function handleUnauthorized(session) {
  if (session.reason === "expired") {
    clearSession();
    await mensajeAlert({
      icon: "info",
      title: "Sesión expirada",
      text: "Vuelve a iniciar sesión.",
      showConfirmButton: true
    });
    return window.location.href = session.redirect;
  }

  await mensajeAlert({
    icon: "warning",
    title: "No autorizado",
    text: "No tienes permiso para acceder a esta sección.",
    showConfirmButton: true
  });

  return window.location.href = session.redirect;
}
