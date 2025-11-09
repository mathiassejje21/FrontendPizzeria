import Swal from "sweetalert2";

export const mensajeAlert = ({
  icon = "info",
  title = "",
  text = "",
  showConfirmButton = false,
  confirmButtonText = "OK",
  timer = "",
} = {}) => {
  let htmlIcon = "";
  let btnColor = "";

  if (icon === "success") {
    htmlIcon = `
      <div style="
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid rgba(0,255,0,0.8);
        background: rgba(0,255,0,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
      ">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(0,255,0,0.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    `;
    btnColor = "rgba(0, 200, 0, 0.85)";
  } else if (icon === "error") {
    htmlIcon = `
      <div style="
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid rgba(255,0,0,0.8);
        background: rgba(255,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
      ">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,0,0,0.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    `;
    btnColor = "rgba(255, 0, 0, 0.85)";
  } else {
    btnColor = "rgba(255, 255, 255, 0.3)";
  }

  return Swal.fire({
    title,
    html: `${htmlIcon}<p style="margin-top:8px;">${text}</p>`,
    showConfirmButton,
    confirmButtonText,
    timer,
    background: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    backdrop: `
      rgba(0,0,0,0.5)
      blur(10px)
    `,
    customClass: {
      popup: "swal-glass-popup",
      title: "swal-glass-title",
      htmlContainer: "swal-glass-text"
    },
    didOpen: (popup) => {
      popup.style.border = "1px solid rgba(255, 255, 255, 0.2)";
      popup.style.borderRadius = "18px";
      popup.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.25)";
      popup.style.backdropFilter = "blur(15px)";

      const confirmBtn = popup.querySelector(".swal2-confirm");
      if (confirmBtn) {
        confirmBtn.style.background = btnColor;
        confirmBtn.style.border = "none";
        confirmBtn.style.color = "#fff";
        confirmBtn.style.fontWeight = "600";
        confirmBtn.style.borderRadius = "10px";
        confirmBtn.style.padding = "8px 20px";
        confirmBtn.style.transition = "all 0.2s ease-in-out";
        confirmBtn.style.boxShadow = `0 4px 10px ${btnColor === "rgba(255, 0, 0, 0.85)" ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.3)"}`;
        confirmBtn.onmouseenter = () => confirmBtn.style.background = btnColor.replace("0.85", "1");
        confirmBtn.onmouseleave = () => confirmBtn.style.background = btnColor;
        confirmBtn.style.cursor = "pointer";
      }
    }
  });
};
