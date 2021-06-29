import mercadoPAgo from 'mercadopago';
import {mercadoPago} from '../config/key'
import axios from 'axios';

const mercadopago:any = mercadoPAgo

mercadopago.configure({
  sandbox: true,
  access_token: mercadoPago.ACCESS_TOKEN
});

const instance = axios.create({
  baseURL: 'https://api.mercadopago.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${mercadoPago.ACCESS_TOKEN}`
  }
});

export async function createSinglePreference(product: any, host: string){
  try {

    let preference ={
      "back_urls": {
        "success": `http://${host}/compras/${product._id}/status`,
        "failure": `http://${host}/compras/${product._id}/status`,
        "pending": `http://${host}/compras/${product._id}/status`
      },
      "auto_return": "approved",
      items:  [{}]
      
    }
    let item = {title:String, unit_price: 0, quantity: 0};

    item.title = product.name;
    item.unit_price = parseFloat(product.price);
    item.quantity = 1; 
    preference.items.push(item);
    preference.items.splice(0, 1);
    return preference;
  } catch (error) {
    throw error;
  }
}

export async function approvedPayment(id: string, product:any){
  try {
    const response =await instance.get(`/payments/${id}`)
    if(response.data.transaction_amount==product.price && response.data.status=='approved' && response.data.additional_info.items[0].title==product.name){
      return 'approved'
    }else{
      return 'denied'
    }

  } catch (error) {
    throw error;
  }
}

export default mercadopago;