import {Request, Response, NextFunction} from 'express'

export function isAdmin( req: any, res: any, next: any){
  if(!req.user){
    req.flash('info', 'Debe ser administrador para acceder');
    return res.redirect('/login');
  }
  if(req.user.type == 0){
    return next();
  }
  req.flash('info', 'Debe ser un administrador para poder ver esta información' );
  return res.redirect('back');
}

export function isUser (req:any, res:any, next:any){
  if(!req.user){
    req.flash('info','Para comprar este mueble, crea una cuenta o inicia sesión');
    return res.redirect('/login');
  }
  if(req.user.type == 1){
    return next();
  }
  req.flash('info', 'Debe ser cliente o vendedor para ver esta información')
  return res.redirect('back');
}

export function isLogged(req: any, res: any, next: any){
  if(req.user){

    let route: string = '';
    switch(req.user.type){
      case 0: 
        route = '/admin/';
        break;
      case 1:
        route = '/mis-productos-ofertados';
        break;
      default:
        route = '/salir';
        break
    }

    //req.flash('info', 'Ya esta logeado!' );
    return res.redirect(route);
  }
  return next();
}
