import Navigo from 'navigo';
import { authRoutes } from '@router/authRoutes.mjs';
import { showLoader, hideLoader } from '@components/loader.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';


export const router = new Navigo('/',{ hash: false });

router.on('/', () => {window.location.href = '/pizzeria'});
router.on('/trabajadores', () => {window.location.href = '/trabajadores/login'});

authRoutes(router);

router.notFound(async () => {
  showLoader();

  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  hideLoader();
  mensajeAlert({
    icon: 'error',
    title: 'Ruta no encontrada',
    text: 'La página que intentas acceder no existe.',
    showConfirmButton: true
  }).then(() => {
    window.location.href = '/pizzeria';
  });
  
  
});

router.resolve();

