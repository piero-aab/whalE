import { Request, Response, NextFunction } from 'express'
import User from '../models/User';
import Product from '../models/Product';
import SubCategory from '../models/SubCategory';
import {productsPerUser,deleteFile} from '../loaders/excelJS';
import {htmlnMailService} from '../loaders/nodeMailer'
import Complaint from '../models/Complaint';

class AdminController {

  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const users = await User.find({type:1});

      //const myProducts = await Product.find(WHERE, SELECT)
      console.log(users)
      res.render('Admin/all-users', {users});
    } catch (error) {
      return next(error);
    }
  }

  public getAllProducts = async (req: Request, res: Response, next: NextFunction) => {

    try {

      //const id = req.user._id
      //const where = {"customer": id}

      const products = await Product.find({$or:[ {'status': 0}, {'status': 1}]}).populate("subCategory");

      //const myProducts = await Product.find(WHERE, SELECT)
      res.render('Admin/all-products', {products});
    } catch (error) {
      return next(error);
    }
  }

  public getSoldProducts = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const products = await Product.find({status:2}).populate("subCategory").populate("buyer").populate("customer");
      const sellers = await User.find({$nor: [{sales: {$exists: false}},{sales: {$size: 0}}]});
      res.render('Admin/sold-products', {products,sellers});
    } catch (error) {
      return next(error);
    }
  }
  
  public exportUsers = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const users = await User.find({type:{ $ne: 0 }}).populate({
        path: "purchases", model: Product, 
        populate : {
          path : 'subCategory',
          model: SubCategory
        }
      });
      const {filepath, filename} = await productsPerUser(users)
      return res.download(filepath,filename,(error)=>{
        if(error) throw "Error al descargar excel de usuarios"
        deleteFile(filepath)
      })
    } catch (error) {
      return next(error);
    }
  }

  public getProductDetail = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {id}= req.params
      const product = await Product.findById(id).populate("subCategory").populate("category", 'name');
      res.render('Admin/product-detail', {product});
    } catch (error) {
      return next(error);
    }
  }

  public getProductDelete = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {id}= req.params
      const product = await Product.findById(id);

      res.render('Admin/delete-product', {product});
    } catch (error) {
      return next(error);
    }
  }

  public postProductDelete = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {id} = req.params
      const { message } = req.body;
      const product = await Product.findByIdAndUpdate(id, { status: 3 });
      const {headers} = req;
      const customerId = product?.customer;
      const customer = await User.findById(customerId);
      const email: string = customer?.email!;

      // Send email
      const subject: string ="WhalE: Producto Elimando";
      const text: string = `<html>
                            <body>
                              <p><strong>Hola ${customer?.name}, Se ha eliminado el siguiente producto:</strong></p>
                              <img src="${product && product.images?product.images[0]:''}" style="max-height: 350px;" width="350" alt="">
                              <p><strong>Producto:</strong></p>
                              <span style="margin-left: 50px;">Nombre: ${product && product.name!=''?product.name:''}</span>
                              <p><strong>Motivo de eliminación:</strong></p>
                              <span style="margin-left: 50px;">${message}</span>
                              <p>Visita la web en: http://${headers.host}</p>
                              <p>Atentamente,</p>
                              <p><strong>El equipo de WhalE</strong></p>
                            </body>
                          </html>`
      await htmlnMailService("no-reply@whale.pe", email, subject, text);
      
      // Return to products page
      req.flash("success", 'Producto eliminado correctamente');
      return res.redirect('/admin/productos-ofertados');

    } catch (error) {
      return next(error);
    }
  }

  public getAllComplaints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const complaints = await Complaint.find();
      res.render('Admin/all-complaints', { complaints });
    } catch (error) {
      return next(error);
    }
  }

  public getAnswerComplaint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const complaint = await Complaint.findById(id);

      res.render('Admin/answer-complaint', { complaint })
    } catch (error) {
      return next(error);
    }
  }

  public postAnswerComplaint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { answer } = req.body;
      const complaint: any = await Complaint.findByIdAndUpdate(id, { status: 1, answer });
      
      const email = complaint.customerEmail;

      // Send email
      const subject: string ="WhalE: Tenemos una respuesta a tu queja";
      const text: string = `<html>
                            <body>
                              <p><strong> Hola ${complaint.customerName}, tenemos una respuesta para tu queja: </strong></p>
                              ${complaint && complaint.images ? '<img src="' + complaint.images[0] + '" style="max-height: 350px;" width="350" alt="">' : ''}
                              <p><strong> Queja ID: ${id && id.substring(id.length - 5) } </strong></p>
                              <span style="margin-left: 50px;">Motivo: ${complaint && complaint.reason!=''?complaint.reason:''} </span>
                              <p><strong>Detalle de tu queja:</strong> ${complaint && complaint.details!=''?complaint.details:''} </p>
                              <span style="margin-left: 50px; color: blue">Respuesta a tu queja: ${answer} </span>

                              <p>Atentamente,</p>
                              <p><strong>El equipo de WhalE</strong></p>
                            </body>
                          </html>`
      await htmlnMailService("no-reply@whale.pe", email, subject, text);
      console.log(email, text, complaint);
      
      req.flash("success", 'Queja respondida correctamente');
      return res.redirect('/admin/lista-quejas');

    } catch (error) {
      return next(error);
    }
  }

  public getComplaintDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const complaint = await Complaint.findById(id);

      res.render('Admin/complaint-detail', { complaint })
    } catch (error) {
      return next(error);
    }
  }
}

const adminController = new AdminController();
export default adminController;
