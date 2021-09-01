import {Router} from 'express';
import customerController from '../controllers/customer-controller';
import { isUser }  from '../middleware/auth'
import { productStatus, isMyProduct}  from '../middleware/product'

const router : Router = Router();

router.get('/mis-productos-ofertados', [isUser], customerController.getMyProducts)
router.get('/crear-producto', [isUser], customerController.getCreateProduct)
router.post('/crear-producto', [isUser], customerController.postCreateProduct)
router.get('/mis-productos-vendidos', [isUser], customerController.getMySoldProducts)
router.get('/detalle/:id', customerController.getProductDetail)
router.get('/producto/:id/comprar', [existUser,isUser,productStatus,isMyProduct], customerController.getBuyProduct)
router.get('/compras/:id/status', [isUser], customerController.getPaymentStatus)
router.post('/usuario/contacto/:id', [isUser], customerController.setContatInfo)
router.get('/editar/:id', [isUser], customerController.getEditProduct)
router.post('/editar/:id', [isUser], customerController.postEditProduct)

export default router;
