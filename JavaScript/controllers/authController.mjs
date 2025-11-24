import { authApi } from "@/api/authApi.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { redirectByRole } from "@/service/redirectByRole.mjs";

export class authController {
  constructor() {
    this.api = new authApi();
  }

  async processLogin(email, password) {
    try {
      const res = await this.api.login(email, password);
      if (res.status !== 200) return null;

      const user = await this.api.getProfile();
      return user;

    } catch (err) {
      const errorTitle = err.response
        ? "Error " + err.response.status
        : err.request
          ? "Error de conexión"
          : "Error inesperado";

      const errorText = err.response
        ? err.response.data?.mensaje || "Ocurrió un error en la solicitud."
        : err.request
          ? "No se pudo conectar con el servidor."
          : "Intenta nuevamente.";

      mensajeAlert({
        icon: "error",
        title: errorTitle,
        text: errorText,
        showConfirmButton: true
      });

      return null;
    }
  }

  async processRegister(nombre, email, password) {
    try {
      const res = await this.api.register(nombre, email, password);
      if (res.status !== 201) return null;
      return true;

    } catch (error) {
      const errorTitle = error.response
        ? "Error " + error.response.status
        : error.request
          ? "Error de conexión"
          : "Error inesperado";

      const errorText = error.response
        ? error.response.data?.mensaje || "Ocurrió un error en la solicitud."
        : error.request
          ? "No se pudo conectar con el servidor."
          : "Intenta nuevamente.";

      mensajeAlert({
        icon: "error",
        title: errorTitle,
        text: errorText,
        showConfirmButton: true,
        confirmButtonText: "Intentar nuevamente"
      });

      return false;
    }
  }

  async logout() {
    const result = await mensajeAlert({
      icon: "warning",
      title: "Cerrar sesión",
      text: "¿Deseas cerrar sesión?",
      showConfirmButton: true,
      confirmButtonText: "Cerrar sesión",
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return null;

    try {
      await this.api.logout();
    } finally {
      sessionStorage.clear();
      const url = redirectByRole();
      location.href = url;
    }
  }
}
