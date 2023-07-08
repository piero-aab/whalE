import { Request, Response, NextFunction, request } from 'express'
import mercadoPago from '../loaders/mercadoPago'
import {createSinglePreference,approvedPayment} from '../loaders/mercadoPago'
import { htmlnMailService } from '../loaders/nodeMailer';
import Category from '../models/Category'
import Product from '../models/Product'
import Payment from '../models/Payment'
import Complaint from '../models/Complaint';
import User from '../models/User'

async function  formatDate(date:Date){
  let d = new Date(date)
  let year=d.getFullYear()
  let month=d.getMonth()+1
  let day=d.getDate()
  const newDate = day.toString().padStart(2, "0") + ' - ' + month.toString().padStart(2, "0") + ' - ' + year
  return newDate
}
class CustomerController {
  
  /* Blogs */

  public getMyProducts = async (req: any, res: Response, next: NextFunction) => {

    try {

      const id = req.user._id
      const where = {"customer": id, $or:[ {'status': 0}, {'status': 1} ]}

      const products = await Product.find(where).populate("subCategory");

      //const myProducts = await Product.find(WHERE, SELECT)
      res.render('Customer/my-products', {products});
    } catch (error) {
      return next(error);
    }
  }



  public getCreateProduct = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const categories = await Category.find().populate("subcategories");
      res.render('Customer/create-product',{categories});
    } catch (error) {
      return next(error);
    }
  }


  public postCreateProduct = async (req: any, res: Response, next: NextFunction) => {

    try {

      const id = req.user._id
      const product = req.body;
      product.customer = id;
      product.status = product.status;
      let images = [];
      let bankData={
        bankName:  product.bankName,
        bankCCI: product.bankCCI,
        bankCC: product.bankCC
      }
      await User.findByIdAndUpdate(req.user._id,{bankData:bankData})
      if(!Array.isArray(product.image)){
        images.push(product.image);
        product.images = images;
      } 
      else {
        product.images = product.image
      }
      
      await Product.create(product);
      req.flash('success',"Producto creado");
      res.redirect('/mis-productos-ofertados');
    } catch (error) {
      return next(error);
    }
  }

  public getBuyProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params 
      const {host} = req.headers;
      const product = await Product.findById(id).populate("category").populate("subCategory");
      const preference = await createSinglePreference(product, host);
      let respId =''
      await mercadoPago.preferences.create(preference).then((response:any)=>{
        respId = response.body.id;
      })
      const payment = await Payment.findOne({product:id, buyer:req.user._id, status:0})
      if(payment){
        await Payment.findByIdAndUpdate(payment._id,{preference_id:respId}).then(()=>{
          req.flash('info',"Para completar tu compra, es necesario actualizar tus preferencias")
          return res.render('Customer/buy-product',{product,payment:payment, id:respId});
        })
      }else{
        const newPayment = {
          product: id,
          buyer: req.user._id,
          preference_id: respId
        }
        await Payment.create(newPayment).then((payment)=>{
          req.flash('info',"Para completar tu compra, es necesario actualizar tus preferencias")
          return res.render('Customer/buy-product',{product,payment:payment, id:respId});
        })   
      }
    } catch (error) {
      return next(error);
    }
  }

  public getPaymentStatus = async (req: any, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params 
      if(req.query){
        const payment = await Payment.findOne({product:id, buyer:req.user._id})
        if(payment&&payment.status==0){
          const product = await Product.findById(id).populate("customer").populate("category").populate("subCategory");
          const customerId = product&&product.customer?product.customer:''
          const productId = product&&product._id?product._id:''
          const today = new Date
          let {preference_id,status, payment_id}=req.query
          today.setHours(today.getHours() - 5);
          const paymentStatus = await approvedPayment(payment_id,product);
          if(payment && preference_id==payment.preference_id && status=='approved' && paymentStatus=='approved'){
            await Payment.findByIdAndUpdate(payment._id,{status:1,payment_id:payment_id})
            const productUpdated = await Product.findByIdAndUpdate(id,{status:2, buyer:req.user._id, saleDate:today})
            const buyer = await User.findByIdAndUpdate(req.user._id,{$push:{purchases:productId}})
            await User.findByIdAndUpdate(customerId,{$push:{sales:productId}})
            const date = await formatDate(today)
            const subject1 = `WhalE - Detalle de tu compra`
            const text1 = `<html>
                <body>
                  <p><strong>¡Tu pedido está completo, ${req.user.name}!</strong></p>
                  <img src=${product && product.images?product.images[0]:''} style="max-height: 350px;" width="350" alt="">
                  <p><strong>Producto:</strong></p>
                  <span style="margin-left: 50px;">Nombre: ${product && product.name!=''?product.name:''}</span>
                  <br>
                  <span style="margin-left: 50px;">Tipo: ${product && product.category?product.category.name:''}</span>
                  <br>
                  <span style="margin-left: 50px;">Precio: ${product && product.price?product.price:''} nuevos soles</span>
                  
                  <p><strong>Detalle de entrega:</strong></p>
                  <span style="margin-left: 50px;">Tipo de entrega: ${payment && payment.contact?payment.contact.deliveryType:''}</span>
                  <br>
                  <span style="margin-left: 50px;">Teléfono: ${payment && payment.contact?payment.contact.phone:''}</span>
                  <br>
                  <span style="margin-left: 50px;">Dirección: ${payment && payment.contact?payment.contact.address:''}</span>
                  
                  <p><strong>Vendedor:</strong></p>
                  <span style="margin-left: 50px;">Nombre: ${product && product.customer?product.customer.name:''}</span>
                  <br>
                  <span style="margin-left: 50px;">Teléfono: ${product && product.customer?product.customer.phone:''}</span>
                  <p><strong>Pago:</strong></p>
                  <span style="margin-left: 50px;">Fecha: ${date?date:''}</span>
                  <br>
                  <span style="margin-left: 50px;">Total cancelado: ${product && product.price?product.price:''} nuevos soles</span>
                  <p><strong>El equipo de WhalE</strong></p>
                </body>
              </html>`
            const subject2 = `WhalE - ¡Tu mueble fue vendido!`
            const text2 =  `<html>
              <body>
                <p><strong>¡Felicidades, ${product && product.customer?product.customer.name:''}, tu producto ha sido vendido!</strong></p>
                <img src="${product && product.images?product.images[0]:''}" style="max-height: 350px;" width="350" alt="">
                <p><strong>Producto:</strong></p>
                <span style="margin-left: 50px;">Nombre: ${product && product.name!=''?product.name:''}</span>
                <br>
                <span style="margin-left: 50px;">Precio a depositar: ${product && product.basePrice?product.basePrice:''} nuevos soles</span>
                <br>
                <span style="margin-left: 50px;">Precio con comisión de WhalE: ${product && product.price?product.price:''} nuevos soles</span>
                <br>
                <span style="margin-left: 50px;">Fecha de compra: ${date?date:''}</span>
                <p>Ahora, ponte en contacto con el comprador del producto</p>
                <p><strong>Detalles del Comprador:</strong></p>
                <span style="margin-left: 50px;">Nombre: ${req.user.name}</span>
                <br>
                <span style="margin-left: 50px;">Teléfono: ${req.user.phone}</span>
                <br>
                <span style="margin-left: 50px;">Correo: ${req.user.email}</span>
            
                <p><strong>Detalle de envio:</strong></p>
                <span style="margin-left: 50px;">Tipo de entrega: ${payment && payment.contact?payment.contact.deliveryType:''}</span>
                <br>
                <span style="margin-left: 50px;">Dirección de entrega: ${payment && payment.contact?payment.contact.address:''}</span>
            
                <p>Gracias por ser parte de la comunidad WhalE, juntos estamos generando un cambio sostenible gracias al reúso de muebles.</p>
                <P>Este mensaje es para informarte que el equipo WhalE está emitiendo el pago de tu mueble vendido a tu cuenta bancaria registrada en nuestra plataforma.</p>
                <P>Recuerda que en WhalE no solo ahorramos dinero, tambié emisiones de CO2.</p>
                <p>¡Te esperamos pronto!</p>
                <p><strong>El equipo de WhalE</strong></p>
              </body>
            </html>`
            await htmlnMailService('soporte@whale.com',req.user.email,subject1,text1)
            await htmlnMailService('soporte@whale.com',product && product.customer?product.customer.email:'',subject2,text2).then(()=>{
              req.flash('success',"Producto Comprado");
              return res.render('Customer/payment-constancy',{product, payment,buyer, date});
            })
          }else if(status!='approved'){
            req.flash('errors',"Error al ejecutar el Pago");
            return res.redirect(`/producto/${id}/comprar`)
          }
        }else if(payment&&payment.status==1){
          req.flash('info',"Ya compro el producto");
          const buyer =await User.findById(req.user._id)
          const product = await Product.findById(id).populate("customer").populate("category").populate("subCategory");
          const date = await formatDate(product?product.saleDate:new Date)
          return res.render('Customer/payment-constancy',{product, payment,buyer, date});
        }else{
          req.flash('errors',"El producto ya fue adquirido");
          return res.redirect(`/`)
        }
      }
    } catch (error) {
      return next(error);
    }
  }

  public getMySoldProducts = async (req: any, res: Response, next: NextFunction) => {
    try {
      const id = req.user._id
      const where = {"customer": id, "status": 2}
      const products = await Product.find(where).populate("subCategory").populate("customer").populate("buyer");
      //const sellers = await User.find({$nor: [{sales: {$exists: false}},{sales: {$size: 0}}]});
      res.render('Customer/my-sold-products', {products});
    } catch (error) {
      return next(error);
    }
  } 
  public setContatInfo = async (req: any, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params 
      const {address, phone, deliveryType, paymentId} = req.body
      const contact={
        address:address,
        phone:phone,
        deliveryType:deliveryType
      }
      const payment = await Payment.findByIdAndUpdate(paymentId,{contact:contact})
      const product = await Product.findById(payment?payment.product:'')
      await User.findByIdAndUpdate(id,{address:address}).then((response:any)=>{
        return res.json({statusProduct:product?product.status:5});
      }) 
    } catch (error) {
      return res.sendStatus(400);
    }
  }

     

  public getProductDetail = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {id}= req.params
      const product = await Product.findById(id).populate("subCategory").populate("category", 'name');

      res.render('Customer/product-detail', {product});
    } catch (error) {
      return next(error);
    }
  }

  public getEditProduct = async (req: any, res: Response, next: NextFunction) => {

    try {
      const {id}= req.params
      const product = await Product.findById(id).populate("subCategory").populate("category", 'name');

      const categories = await Category.find().populate("subcategories");
      res.render('Customer/edit-product', {categories, product} );
    } catch (error) {
      return next(error);
    }
  }

  public postEditProduct = async (req: any, res: Response, next: NextFunction) => {

    try {
      const {id}= req.params
      const user_id = req.user._id

      const product = req.body;
      product.customer = user_id;
      
      let images = [];
      let bankData={
        bankName:  product.bankName,
        bankCCI: product.bankCCI,
        bankCC: product.bankCC
      }
      await User.findByIdAndUpdate(req.user._id,{bankData:bankData})
      if(!Array.isArray(product.image)){
        images.push(product.image);
        product.images = images;
      } 
      else product.images = product.image;

      const editedProduct = await Product.findByIdAndUpdate(id, product)
      req.flash('success',"Producto editado");
      return res.redirect('/mis-productos-ofertados');
    } catch (error) {
      return next(error);
    }
  }

  public getComplaint = async (req: any, res: Response, next: NextFunction) => {

    try {
      res.render('Customer/new-complaint');
    } catch (error) {
      return next(error);
    }
  }

  public postComplaint = async (req: any, res:Response, next: NextFunction) => {
    
    try {
      const complaint = req.body
      console.log(req.body, complaint)
      let images = []

      if(!Array.isArray(complaint.image)){
        images.push(complaint.image);
        complaint.images = images;
      } 
      else {
        complaint.images = complaint.image
      }

      const data = await Complaint.create(complaint)
      const id = data._id.toString()

      const  { customerEmail } = complaint
      const adminEmail = 'getab152@gmail.com'

      const customerSubject: string = `Registro de queja ID: ${id.substring(id.length - 5)}`;
      const adminSubject: string = `Aviso de nueva queja creada ID: ${id.substring(id.length - 5)}`;

      const imagesHtml = complaint.images.map((image: any) => '<img src="' + image + '" style="max-height: 350px; margin: 16px; border-radius: 10px; box-shadow: 4px 5px 19px -3px rgba(0,0,0,0.32)" width="350" alt="">').join('\n')
      
      const customerText: string = `<html>
                            <body>
                              <p style="font-size:24px; margin-bottom:16px"> Hola ${complaint.customerName}, hemos recibido tu queja. </p>
                              <p style="font-size:20px; margin: 16px 0"> Datos de la queja: </p>
                              <p style="margin: 0 16px"><strong> Queja ID: ${id && id.substring(id.length - 5) } </strong></p>
                              <p style="margin: 0 16px"><strong> Nombre:</strong> ${complaint && complaint.customerName!=''?complaint.customerName:''} </p>
                              <p style="margin: 0 16px"><strong> Correo eléctronico:</strong> ${complaint && complaint.customerEmail!=''?complaint.customerEmail:''} </p>
                              <p style="margin: 0 16px"><strong> Número de teléfono:</strong> ${complaint && complaint.customerPhone!=''?complaint.customerPhone:''} </p>
                              <p style="margin: 0 16px"><strong> Motivo: </strong>${complaint && complaint.reason!=''?complaint.reason:''} </p>
                              <p style="margin: 0 16px"><strong> Detalle de tu queja:</strong> ${complaint && complaint.details!=''?complaint.details:''} </p>
                              <p style="margin: 0 16px"><strong> Posible solución: </strong>${complaint && complaint.pSolution!=''?complaint.pSolution:''} </p>
                              <p style="margin: 0 16px 16px"><strong> Imágenes: </strong></p>
                              <div style="display: flex; justify-content: center; flex-wrap: wrap;">
                                ${imagesHtml}
                              </div>

                              <p>Atentamente,</p>
                              <p><strong>El equipo de WhalE</strong></p>
                            </body>
                          </html>`

        const adminText: string = `<html>
                          <body>
                            <p style="font-size:24px; margin-bottom:16px"> Nueva queja registrada </p>
                            <p style="font-size:20px; margin: 16px 0"> Datos: </p>
                            <p style="margin: 0 16px"><strong> Queja ID: ${id && id.substring(id.length - 5) } </strong></p>
                            <p style="margin: 0 16px"><strong> Nombre:</strong> ${complaint && complaint.customerName!=''?complaint.customerName:''} </p>
                            <p style="margin: 0 16px"><strong> Correo eléctronico:</strong> ${complaint && complaint.customerEmail!=''?complaint.customerEmail:''} </p>
                            <p style="margin: 0 16px"><strong> Número de teléfono:</strong> ${complaint && complaint.customerPhone!=''?complaint.customerPhone:''} </p>
                            <p style="margin: 0 16px"><strong> Motivo: </strong>${complaint && complaint.reason!=''?complaint.reason:''} </p>
                            <p style="margin: 0 16px"><strong> Detalle de tu queja:</strong> ${complaint && complaint.details!=''?complaint.details:''} </p>
                            <p style="margin: 0 16px"><strong> Posible solución: </strong>${complaint && complaint.pSolution!=''?complaint.pSolution:''} </p>
                            <p style="margin: 0 16px 16px"><strong> Imágenes: </strong></p>
                            <div style="display: flex; justify-content: center; flex-wrap: wrap;">
                              ${imagesHtml}
                            </div>

                            <p style="margin: 16px 16px 0">Atentamente,</p>
                            <p><strong>El equipo de WhalE</strong></p>
                          </body>
                        </html>`
      
      await htmlnMailService("no-reply@whale.pe", customerEmail, customerSubject, customerText)
      await htmlnMailService("no-reply@whale.pe", adminEmail, adminSubject, adminText)

      req.flash('success', 'Queja registrada')
      res.redirect('/');
    } catch (error) {
      return next(error)
    }
  }

  
}

const customerController = new CustomerController();
export default customerController;
