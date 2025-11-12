import { authApi } from "@/api/authApi.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export class authController {
  constructor() {
    this.api = new authApi();
  }

  async processLogin(email, password) {
    try {
      const res = await this.api.login(email, password);
      if (res.status !== 200) return;

      const user = await this.api.getProfile();
      await sessionStorage.setItem("user", JSON.stringify(user));

      const path = window.location.pathname.toLowerCase();
      let redirectUrl = null;

      if (path === "/pizzeria/login" && user.rol === "cliente") {
        redirectUrl = "/pizzeria/dashboard";
      } else if (path === "/trabajadores/login" && user.rol === "administrador") {
        redirectUrl = "/administrador/dashboard";
      } else if (path === "/trabajadores/login" && user.rol === "personal") {
        redirectUrl = "/personal/dashboard";
      }

      if (redirectUrl) {
        mensajeAlert({
          icon: "success",
          title: "¡Bienvenido!",
          text: res.mensaje,
          timer: 1800
        }).then(() => {
          location.href = redirectUrl;
        });
        return user;
      }else{
        mensajeAlert({
          icon: "error",
          title: "Acceso denegado",
          text: "Tu rol no tiene permiso para acceder a esta sección.",
          showConfirmButton: true
        }).then(async () => {
          await sessionStorage.removeItem("user");
          if (user.rol === "cliente") {
            location.href = "/pizzeria/login";
          } else {
            location.href = "/trabajadores/login";
          }
        })
        return;
      }
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
    }
  }
  
  async processRegister(nombre, email, password){
    try {
      const res = await this.api.register(nombre, email, password);
      if(res.status !== 201) return;
      mensajeAlert({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta fue creada correctamente.",
        showConfirmButton: true,
        confirmButtonText: "Ir al login"
      }).then(() => {
        location.href = "/pizzeria/login";
      });
    }catch (error) {
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
    }
  }
async logout() {
  if (sessionStorage.getItem("user")) {
    const userData = await JSON.parse(sessionStorage.getItem("user"));
    const rol = userData?.rol;

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

    await this.api.logout();
    await sessionStorage.removeItem("user");

    if (rol === "cliente") {
      location.href = "/pizzeria/login";
    } else {
      location.href = "/trabajadores/login";
    }
    return;
  }
}

}
