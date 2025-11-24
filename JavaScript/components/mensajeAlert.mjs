import Swal from "sweetalert2";

export const mensajeAlert = ({
  icon = "info",
  title = "",
  text = "",
  showConfirmButton = false,
  confirmButtonText = "OK",
  showCancelButton = false,
  cancelButtonText = "Cancelar",
  timer = 0,
} = {}) => {

  if (icon === "success" && !showConfirmButton && timer === 0) timer = 1800;

  let htmlIcon = "";
  let btnColor = "";

  if (icon === "success") {
    htmlIcon = `
      <div style="
        width: 70px; height: 70px;
        border-radius: 50%;
        border: 3px solid rgba(0,255,0,0.8);
        background: rgba(0,255,0,0.06);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px;
      ">
        <svg width="38" height="38" viewBox="0 0 24 24"
          fill="none" stroke="rgba(0,255,0,0.95)" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>`;
    btnColor = "rgba(0, 200, 0, 0.9)";
  }

  if (icon === "error") {
    htmlIcon = `
      <div style="
        width: 70px; height: 70px;
        border-radius: 50%;
        border: 3px solid rgba(255,0,0,0.8);
        background: rgba(255,0,0,0.06);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px;
      ">
        <svg width="38" height="38" viewBox="0 0 24 24"
          fill="none" stroke="rgba(255,0,0,0.95)" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>`;
    btnColor = "rgba(255, 0, 0, 0.9)";
  }

  if (icon === "warning") {
    htmlIcon = `
      <div style="
        width: 70px; height: 70px;
        border-radius: 50%;
        border: 3px solid rgba(255,193,7,0.9);
        background: rgba(255,193,7,0.06);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px;
      ">
        <svg width="38" height="38" viewBox="0 0 24 24"
          fill="none" stroke="rgba(255,193,7,0.95)" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2 L22 18 H2 Z"></path>
          <line x1="12" y1="8" x2="12" y2="13"></line>
          <circle cx="12" cy="17" r="1"></circle>
        </svg>
      </div>`;
    btnColor = "rgba(255, 193, 7, 0.95)";
  }

  return Swal.fire({
    title: title ? `<span style="color:#fff;">${title}</span>` : "",
    html: `${htmlIcon}${text ? `<p style="margin-top:8px; color:#fff;">${text}</p>` : ""}`,
    icon: undefined,
    background: "rgba(20, 20, 20, 0.35)",
    color: "#ffffff",
    showConfirmButton,
    confirmButtonText,
    showCancelButton,
    cancelButtonText,
    timer: timer > 0 ? timer : undefined,
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: `
      rgba(0,0,0,0.55)
      blur(18px)
    `,
    customClass: {
      popup: "swal-glass-popup",
      title: "swal-glass-title",
      htmlContainer: "swal-glass-text"
    },
    didOpen: (popup) => {
      popup.style.border = "1px solid rgba(255,255,255,0.35)";
      popup.style.borderRadius = "18px";
      popup.style.background = "rgba(40,40,40,0.55)";
      popup.style.backdropFilter = "blur(15px)";
      popup.style.boxShadow = "0 10px 40px rgba(0,0,0,0.4)";
      popup.style.zIndex = "999999999";
      const confirmBtn = popup.querySelector(".swal2-confirm");
      const cancelBtn = popup.querySelector(".swal2-cancel");

      if (confirmBtn) {
        confirmBtn.style.background = btnColor;
        confirmBtn.style.border = "none";
        confirmBtn.style.color = "#fff";
        confirmBtn.style.fontWeight = "600";
        confirmBtn.style.borderRadius = "10px";
        confirmBtn.style.padding = "8px 20px";
        confirmBtn.style.cursor = "pointer";
      }

      if (cancelBtn) {
        cancelBtn.style.background = "rgba(255,255,255,0.15)";
        cancelBtn.style.color = "#fff";
        cancelBtn.style.border = "none";
        cancelBtn.style.borderRadius = "10px";
        cancelBtn.style.padding = "8px 20px";
        cancelBtn.style.cursor = "pointer";
      }
    },
  });
};
