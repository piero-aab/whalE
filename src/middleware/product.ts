import {Request, Response, NextFunction} from 'express'
import Product from '../models/Product'
export async function productStatus( req: any, res: any, next: any){
  try {
    if(!req.params.id){
      req.flash('errors', 'Error al obtener producto');
      return res.redirect('/');
    }
    const {id} = req.params 
    await Product.findById(id).then((product:any)=>{
      if(product.status==2){
        req.flash('errors', 'Este producto ya ha sido comprado' );
        return res.redirect('back');
      }else if(product.status==1){
        return next();
      }else{
        req.flash('errors', 'Producto No disponible' );
        return res.redirect('back');
      }
    })
  } catch (error) {
    req.flash('errors', 'Error al obtener información del producto' );
    return res.redirect('back');
  }
}
export async function isMyProduct( req: any, res: any, next: any){
  try {
    if(!req.params.id){
      req.flash('errors', 'Error al obtener producto');
      return res.redirect('/');
    }
    const {id} = req.params 
    await Product.findById(id).then((product:any)=>{
      if(product.customer.toString() == req.user._id.toString()){
        req.flash('errors', 'No puedes comprar tu propio producto' );
        return res.redirect('back');
      }else{
        return next();
      }
    })
  } catch (error) {
    req.flash('errors', 'Error al obtener información del producto' );
    return res.redirect('back');
  }
}