import { Request, Response, NextFunction } from 'express'
import Category from '../models/Category'
import SubCategory from '../models/SubCategory'
import Product from '../models/Product'

class HomeController{
  public index = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const categories = await Category.find().populate("subcategories");
      const order = ['6062116a531f9bd7cc0c50a1', '60620bae531f9bd7cc0c509e', '60620bce531f9bd7cc0c509f', '60621155531f9bd7cc0c50a0', '60621187531f9bd7cc0c50a2', '60621199531f9bd7cc0c50a3'];

      let catSorted: any = [];
      order.forEach((id) => {
        let found = false;
        categories.filter((category) => {
          if (!found && category._id == id) {
            catSorted.push(category);
            found = true;
            return false;
          } else {
            return true;
          }
        })
      })

      const products = await Product.find({status:1}).populate("subCategory");
      const subcategories = await SubCategory.find();
      const icons = ['bedroom', 'office', 'sofa', 'bar-set', 'dining-table', 'media-cabinet']
      
      res.render('Home/index', {categories, subcategories, products, icons, catSorted});

    } catch (error) {
      return next(error);
    }

    
  };  
}

const homeController = new HomeController();
export default homeController
