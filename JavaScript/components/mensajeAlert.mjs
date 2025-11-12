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
  if (icon === "success" && !showConfirmButton && timer === 0) {
    timer = 1800;
  }

  if (timer > 0 && !showConfirmButton) {
    showConfirmButton = false;
    showCancelButton = false;
  }

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
      </div>
    `;
    btnColor = "rgba(0, 200, 0, 0.9)";
  } else if (icon === "error") {
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
      </div>
    `;
    btnColor = "rgba(255, 0, 0, 0.9)";
  } else if (icon === "warning") {
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
      </div>
    `;
    btnColor = "rgba(255, 193, 7, 0.95)";
  }

  return Swal.fire({
    title: title ? `<span style="color:#fff;">${title}</span>` : "",
    html: `${htmlIcon}${text ? `<p style="margin-top:8px; color:#fff;">${text}</p>` : ""}`,
    icon: undefined,
    background: "rgba(255, 255, 255, 0.18)",
    color: "#ffffff",
    showConfirmButton,
    confirmButtonText,
    showCancelButton,
    cancelButtonText,
    timer: timer > 0 ? timer : undefined,
    reverseButtons: true,
    backdrop: `
      rgba(0,0,0,0.45)
      blur(10px)
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: "swal-glass-popup fade-in",
      title: "swal-glass-title",
      htmlContainer: "swal-glass-text"
    },
    didOpen: (popup) => {
      popup.style.border = "1px solid rgba(255, 255, 255, 0.25)";
      popup.style.borderRadius = "18px";
      popup.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.25)";
      popup.style.backdropFilter = "blur(15px)";
      popup.style.transition = "all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)";
      popup.style.opacity = "0";
      popup.style.transform = "scale(0.93) translateY(10px)";
      popup.style.willChange = "transform, opacity";

      requestAnimationFrame(() => {
        popup.style.opacity = "1";
        popup.style.transform = "scale(1) translateY(0)";
      });

      const confirmBtn = popup.querySelector(".swal2-confirm");
      const cancelBtn = popup.querySelector(".swal2-cancel");

      if (confirmBtn) {
        confirmBtn.style.background = btnColor;
        confirmBtn.style.border = "none";
        confirmBtn.style.color = "#fff";
        confirmBtn.style.fontWeight = "600";
        confirmBtn.style.borderRadius = "10px";
        confirmBtn.style.padding = "8px 20px";
        confirmBtn.style.transition = "all 0.35s ease";
        confirmBtn.style.cursor = "pointer";
        confirmBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
        confirmBtn.onmouseenter = () => confirmBtn.style.filter = "brightness(1.15)";
        confirmBtn.onmouseleave = () => confirmBtn.style.filter = "none";
      }

      if (cancelBtn) {
        cancelBtn.style.background = "rgba(255,255,255,0.15)";
        cancelBtn.style.color = "#fff";
        cancelBtn.style.border = "none";
        cancelBtn.style.borderRadius = "10px";
        cancelBtn.style.padding = "8px 20px";
        cancelBtn.style.transition = "all 0.35s ease";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.onmouseenter = () => cancelBtn.style.filter = "brightness(1.15)";
        cancelBtn.onmouseleave = () => cancelBtn.style.filter = "none";
      }
    },
    willClose: (popup) => {
      popup.style.transition = "all 0.55s cubic-bezier(0.4, 0, 0.2, 1)";
      popup.style.opacity = "0";
      popup.style.transform = "scale(0.95) translateY(10px)";
    },
  });
};
