/**
 * Genera el HTML minimalista y elegante para la ventana de carga de impresión.
 */
export const getPrinterLoadingHtml = () => `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Cargando Documento | BlackSilver</title>
    <style>
      body {
        background-color: #030303;
        color: #fafafa;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        overflow: hidden;
        position: relative;
      }

      /* Blobs Animados */
      @keyframes blob1 {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30vw, -15vh) scale(1.1);
        }
        66% {
          transform: translate(-20vw, 20vh) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
      @keyframes blob2 {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(-25vw, 25vh) scale(1.2);
        }
        66% {
          transform: translate(20vw, -20vh) scale(0.8);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
      @keyframes blob3 {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(25vw, -30vh) scale(0.9);
        }
        66% {
          transform: translate(-25vw, 25vh) scale(1.1);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }

      .blob {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        mix-blend-mode: screen;
        filter: blur(120px);
        z-index: 1;
      }
      .blob-1 {
        top: -20%;
        left: -10%;
        width: 60%;
        height: 60%;
        background: rgba(37, 99, 235, 0.13);
        animation: blob1 25s infinite alternate ease-in-out;
      }
      .blob-2 {
        top: 10%;
        right: -5%;
        width: 40%;
        height: 40%;
        background: rgba(124, 58, 237, 0.13);
        animation: blob2 30s infinite alternate ease-in-out;
      }
      .blob-3 {
        bottom: -10%;
        left: 20%;
        width: 50%;
        height: 50%;
        background: rgba(192, 38, 211, 0.13);
        animation: blob3 35s infinite alternate ease-in-out;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;
        animation: fadeIn 1.2s ease-out;
        position: relative;
        bottom: 5%;
        z-index: 10;
      }
      .loader-ring {
        width: 40px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.03);
        border-top: 2px solid #6366f1;
        border-radius: 50%;
        animation: spin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
      }
      .status-text {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        background: linear-gradient(90deg, #818cf8, #c084fc, #818cf8);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 4s linear infinite;
      }
      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }
      @keyframes shimmer {
        to {
          background-position: 200% center;
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  </head>
  <body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <div class="container">
      <div class="loader-ring"></div>
      <div class="status-text">Cargando...</div>
    </div>
  </body>
</html>

`;

/**
 * Abre una ventana en blanco e inyecta la pantalla de carga de BlackSilver.
 * Esta función DEBE llamarse desde un evento de clic sincrónico para evitar el bloqueo del navegador.
 */
export const preparePrinterWindow = (target: string) => {
  const win = window.open("", target);
  if (win) {
    win.document.write(getPrinterLoadingHtml());
    win.document.close(); // Importante para finalizar la escritura
  }
  return win;
};
