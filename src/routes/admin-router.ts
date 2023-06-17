import {Router} from 'express';
import adminController from '../controllers/admin-controller';
import {isAdmin}  from '../middleware/auth'

const router : Router = Router();

router.get('/productos-ofertados', [isAdmin], adminController.getAllProducts)
router.get('/productos-vendidos', [isAdmin], adminController.getSoldProducts)
router.get('/exportar/usuarios', [isAdmin], adminController.exportUsers)
router.get('/usuarios-listar', [isAdmin], adminController.getAllUsers)
router.get('/detalle/:id', [isAdmin], adminController.getProductDetail)
router.get('/eliminar/:id', [isAdmin], adminController.getProductDelete)
router.post('/eliminar/:id', [isAdmin], adminController.postProductDelete)

export default router;
