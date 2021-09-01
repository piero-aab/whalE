
const createProduct = Vue.createApp({
  data(){
    return{
      categories: [],
      subCategories: [],
      categorySelect: "",
      subCategorySelect: "",
      message: "",

      images: [""],

      price: 0,
      finalPrice: 0
    }
  },
  mounted(){
    this.categories = JSON.parse(document.getElementById('create-product').getAttribute('data-categories'));
  },
  watch: {
    categorySelect(){
      if(this.categorySelect!==""){
        let categorySelect = this.categories.filter(category => category._id.toString() === this.categorySelect.toString())
        this.subCategories = categorySelect[0].subcategories;
        this.subCategorySelect = '';
      }else{
        this.subCategories = [];
        this.subCategorySelect = '';
      }
    },
    subCategorySelect(){
      if(this.subCategorySelect!==""){
        console.log(this.subCategorySelect)
        let subCategorySelect = this.subCategories.filter(subcategory => subcategory._id.toString() === this.subCategorySelect.toString())
        console.log(subCategorySelect)
        let message = 
        ` ¡ Estás ahorrando ${ subCategorySelect[0].co2 }kg de CO₂ !

          Esto equivale a ${ subCategorySelect[0].carsRemovedxday } autos eliminados de circulación durante un día,
          a ${ subCategorySelect[0].cottonTshirt } camisetas de algodón,
          a ${ subCategorySelect[0].savedWater } litros de agua ahorrada
          y ${ subCategorySelect[0].treeCo2xday } árboles absorviendo CO₂ en un día.
        `
        this.message = message;
      }else{
        this.message = "";
      }
    },
    price(){
      let price = this.price;
      if(price === 0) this.finalPrice = 0;
      if(!isNaN( price )&& price!=''){
        this.price = parseFloat(price.toFixed(2));
        if(price < 800) this.finalPrice = this.round( price*1.10 );
        else this.finalPrice = this.round(price*1.05);
      }else if(this.price==''){
        this.finalPrice= 0
      }
    }
  },
  methods: {
    addImage(){
      this.images.push("");
    },
    deleteImage(index){
      if(this.images.length>1) this.images.splice(index,1);
    },
    round(numero, decimales = 2) {
      numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
      if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
          return Number(numero.toFixed(decimales));
      } else {
          return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
      }
    },
    cloudinaryWidget(index){
      let myWidget = cloudinary.createUploadWidget(
      {
        // cambiar las credenciales al subir a producción
        api_key:"953288641213821",
        cloudName: 'whale-unmsm',
        uploadPreset: 'ml_default',
        multiple: false
      },(error, result) => {
          if (!error && result && result.event === "success") {
            this.images[index] = result.info.url;
          }
          else{
            console.log(error)
          }
        }
      )

      myWidget.open();
    },
    validatePhotos(e){
      if(this.images.includes("")){
        
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Todos los campos de imágenes que has seleccionado deben estar llenos',
          showConfirmButton: false,
          timer: 3500
        })
        
        e.preventDefault();
        return false; 
      }
      if(this.price==0||this.price==""){
        
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'El precio del mueble no puede ser 0',
          showConfirmButton: false,
          timer: 3500
        })
        
        e.preventDefault();
        return false; 
      }
      if(this.finalPrice==0||this.finalPrice==""){
        
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Digite correctamente el precio del mueble',
          showConfirmButton: false,
          timer: 3500
        })
        
        e.preventDefault();
        return false; 
      }
    }
  }
})

if(document.getElementById("create-product")){createProduct.mount('#create-product')}


const myOfferedProducts = Vue.createApp({
  data(){
    return{
      products: []
    }
  },
  mounted(){
    let products = JSON.parse(document.getElementById("myOfferedProducts").getAttribute("data-myproducts"));
    this.products = products

    console.log(this.products)
    
  },
  methods:{
    openDetail(id){
      return window.location.href = '/detalle/' + id;
    }
  }

})

if(document.getElementById("myOfferedProducts")){const mountedMyOfferedProducts = myOfferedProducts.mount("#myOfferedProducts")}

const mySoldProducts = Vue.createApp({
  data(){
    return{
      products: [],
      productsOrigin: [],
      page:1,
      perPage:20,
      pages:[]
    }
  },
  mounted(){
    let products = JSON.parse(document.getElementById("mySoldProducts").getAttribute("data-mySoldProducts"));
    this.productsOrigin = products
    this.products = this.productsOrigin

    console.log(this.products)
    
  },
  methods:{
    setProducts() {
      this.pages=[]
      let numberOfPages = Math.ceil(this.products.length / this.perPage);
      for (let i = 1; i <= numberOfPages; i++) {
        this.pages.push(i);
      }
    },
    paginate(products) {
      let page = this.page;
      let perPage = this.perPage;
      let from = (page * perPage) - perPage;
      let to = (page * perPage);
      return products.slice(from, to);
    },
  },
  watch:{
    products(){
      this.setProducts()
    }
  },
  computed:{
    displayedProducts: function(){
      return this.paginate(this.products)
    }
  }
})

if(document.getElementById("mySoldProducts")){const mountedMySoldProducts = mySoldProducts.mount("#mySoldProducts")}

const productDetailCustomer = Vue.createApp({
  data(){
    return{
      productDetail: [],
      subCategory: {},
      category: {}
    }
  },
  mounted(){
    let productDetail = JSON.parse(document.getElementById("productDetailCostumer").getAttribute("data-productDetailCostumer"));
    this.productDetail = productDetail
    this.subCategory = productDetail.subCategory
    this.category = productDetail.category
    console.log(this.productDetail, this.subCategory, this.category)  
  }
})

if(document.getElementById("productDetailCostumer")){const mountedProductDetailCostumer = productDetailCustomer.mount("#productDetailCostumer")}



const editProduct = Vue.createApp({
  data(){
    return{
      product: {},
      categories: [],
      subCategories: [],
      categorySelect: "",
      subCategorySelect: "",
      message: "",

      images: [""],

      price: "",
      finalPrice: "",

      isModifiedCategorie: false,
    }
  },
  mounted(){
    this.product = JSON.parse(document.getElementById('editProduct').getAttribute('data-product'));
    this.categories = JSON.parse(document.getElementById('editProduct').getAttribute('data-categories'));
    
    this.categorySelect = this.product.category._id
    this.subCategorySelect = this.product.subCategory._id
    this.price = this.product.basePrice ? this.product.basePrice: this.product.price
    this.images = this.product.images

  },
  methods: {
    addImage(){
      this.images.push("");
    },
    deleteImage(index){
      if(this.images.length>1) this.images.splice(index,1);
    },
    round(numero, decimales = 2) {
      numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
      if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
          return Number(numero.toFixed(decimales));
      } else {
          return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
      }
    },
    cloudinaryWidget(index){
      let myWidget = cloudinary.createUploadWidget(
      {
        // cambiar las credenciales al subir a producción
        api_key:"953288641213821",
        cloudName: 'whale-unmsm',
        uploadPreset: 'ml_default',
        multiple: false
      },(error, result) => {
          if (!error && result && result.event === "success") {
            this.images[index] = result.info.url;
          }
          else{
            console.log(error)
          }
        }
      )

      myWidget.open();
    },
    validatePhotos(e){
      if(this.images.includes("")){
        
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Todos los campos de imágenes que has seleccionado deben estar llenos',
          showConfirmButton: false,
          timer: 3500
        })
        
        e.preventDefault();
        return false; 
      }
      if(this.price==0||this.price==""){
        
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'El precio del producto no puede ser 0',
          showConfirmButton: false,
          timer: 3500
        })
        
        e.preventDefault();
        return false; 
      }
      if(this.finalPrice==0||this.finalPrice==""){
        
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Digite correctamente el precio del mueble',
          showConfirmButton: false,
          timer: 3500
        })
        
        e.preventDefault();
        return false; 
      }
    }
  },
  watch: {
    categorySelect(val, oldVal){
      if((oldVal != '') && (val != oldVal)) this.isModifiedCategorie = true
      
      if(this.categorySelect!==""){
        let categorySelect = this.categories.filter(category => category._id.toString() === this.categorySelect.toString())
        this.subCategories = categorySelect[0].subcategories;
        if(this.isModifiedCategorie){
          console.log('gaaaaaaaaaaaaaa')
          this.subCategorySelect = '';
        }
      }else{
        this.subCategories = [];
        this.subCategorySelect = '';
      }
    },
    subCategorySelect(){
      if(this.subCategorySelect!==""){
        let subCategorySelect = this.subCategories.filter(subcategory => subcategory._id.toString() === this.subCategorySelect.toString())
        let message = 
        ` ¡ Estás ahorrando ${ subCategorySelect[0].co2 }kg de CO₂ !

          Esto equivale a ${ subCategorySelect[0].carsRemovedxday } autos eliminados de circulación durante un día,
          a ${ subCategorySelect[0].cottonTshirt } camisetas de algodón,
          a ${ subCategorySelect[0].savedWater } litros de agua ahorrada
          y ${ subCategorySelect[0].treeCo2xday } árboles absorviendo CO₂ en un día.
        `
        this.message = message;
      }else{
        this.message = "";
      }
    },
    price(){
      let price = this.price;
      if(price === 0) this.finalPrice = 0;
      if(!isNaN( price )&& price!=''){
        this.price = parseFloat(price.toFixed(2));
        if(price < 800) this.finalPrice = this.round( price*1.09 );
        else this.finalPrice = this.round(price*1.07);
      }else if(this.price==''){
        this.finalPrice= 0
      }
    }
  }
})

if(document.getElementById("editProduct")){const mountedEditProduct = editProduct.mount("#editProduct")}
