const allUsers = Vue.createApp({
  data(){
    return{
      users: []
    }
  },
  mounted(){
    let users = JSON.parse(document.getElementById("allUsers").getAttribute("data-allUsers"));
    this.users = users
    console.log(this.users)
    
  },

})

if(document.getElementById("allUsers")){const mountedAllUsers = allUsers.mount("#allUsers")}

const allProducts = Vue.createApp({
  data(){
    return{
      products: []
    }
  },
  mounted(){
    let products = JSON.parse(document.getElementById("allProducts").getAttribute("data-allProducts"));
    this.products = products
    console.log(this.products)
    
  },

})

if(document.getElementById("allProducts")){const mountedAllProducts = allProducts.mount("#allProducts")}

const soldProducts = Vue.createApp({
  data(){
    return{
      products: [],
      productsOrigin: [],
      sellers:[],
      sellerFilter:'',
      page:1,
      perPage:20,
      pages:[]
    }
  },
  mounted(){
    let products = JSON.parse(document.getElementById("soldProducts").getAttribute("data-allProducts"));
    let sellers = JSON.parse(document.getElementById("soldProducts").getAttribute("data-allSellers"));
    this.productsOrigin = products
    this.products = this.productsOrigin
    this.sellers = sellers
    
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
    filterPerSelect(){
      if(this.sellerFilter!=''){
        this.products = this.productsOrigin.filter((p)=>{return p.customer._id.toString()==this.sellerFilter})
      }else{
        this.products= this.productsOrigin
      }
    }
  },
  watch:{
    products(){
      this.setProducts()
    },
    sellerFilter(){
      this.filterPerSelect()
    }
  },
  computed:{
    displayedProducts: function(){
      return this.paginate(this.products)
    }
  }
})

if(document.getElementById("soldProducts")){const mountedSoldProducts = soldProducts.mount("#soldProducts")}

const productDetail = Vue.createApp({
  data(){
    return{
      productDetail: [],
      subCategory: {},
      category: {}
    }
  },
  mounted(){
    let productDetail = JSON.parse(document.getElementById("productDetail").getAttribute("data-productDetail"));
    this.productDetail = productDetail
    this.subCategory = productDetail.subCategory
    this.category = productDetail.category
    console.log(this.productDetail, this.subCategory, this.category)  
  },

})

if(document.getElementById("productDetail")){const mountedProductDetail = productDetail.mount("#productDetail")}


// ALL COMPLAINS
const allComplaints = Vue.createApp({
  data(){
    return{
      complaints: [],
      isActive: false
    }
  },
  mounted() {
    let complaints = JSON.parse(document.getElementById("allComplaints").getAttribute("data-allComplaints"));

    this.isActive = !!(complaints.length === 1)

    this.complaints = complaints.map((complaint, index) => {
      return {
        ...complaint,
        index: index + 1,
        dateTxt: this.formatDate(complaint.createdAt),
        statusTxt: this.formatStatus(complaint.status)
      }
    })
    console.log(this.complaints)
  },
  methods: {
    formatDate(date) {
      const newDate = new Date(date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return newDate.toLocaleDateString('es-ES', options)
    },
    formatStatus(status) {
      return status === 0 ? 'Atendido' : ( status === 1 ? 'Por atender' : '-')
    }
  }
})

if(document.getElementById("allComplaints")){ const mountedAllComplaints = allComplaints.mount("#allComplaints") }