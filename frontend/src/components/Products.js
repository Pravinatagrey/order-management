//import { Button, Stack,Avatar } from "@mui/material";
import {  SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart,{generateCartItemsFrom} from "./Cart";
import FoodMenuTabs from "./FoodMenuTabs";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productData,updateProduct]=useState([]);
  const [isFetching,updateFecthed]=useState(false);
  const [productNotFound]=useState(false);
  const [userLoggedIn,updateUserLoggedIn]=useState(false);
  const [cartData,updateCartData]=useState([]);
  const [userCartItems,updateUserCartItems]=useState([]);
  const [userToken,updateUserToken]=useState("");

  const [activeTab, setActiveTab] = useState("pizza");

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "pizza",
   *          "category": "pizza",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      }
   * ]
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  
  const performAPICall = async () => {
    try{
      updateFecthed(true)
      let url=config.endpoint;
     let product= await axios.get(`${url}/images`);
     updateProduct(product.data);
     updateFecthed(false);
     return product.data;
    }catch(e){
      console.log(e.message)
    }
  };

/**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
 const fetchCart = useCallback(async (token) => {
  if (!token) return;

  try {
    //  Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
   let url=config.endpoint+'/cart';
   let cartDatas=await axios.get(url,{headers:{Authorization:`Bearer ${token}`}});

   
   return cartDatas.data;

  } catch (e) {
    if (e.response && e.response.status === 400) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
    }
    return null;
  }
},[enqueueSnackbar]);
  // Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  useEffect( ()=>{
    async function onLoad(){
       const product=await performAPICall();
      let user=localStorage.getItem('username');
        if (user) {
      updateUserLoggedIn(true);
    }
  //  {user && updateUserLoggedIn(true)}
      let token=localStorage.getItem('token');
      if(token){
        updateUserToken(token);
        const cartItems=await fetchCart(token);
        //console.log()
        updateUserCartItems(cartItems);// Array of objects with productId and quantity of products in cart
        const cartData=await generateCartItemsFrom(cartItems,product)
        updateCartData(cartData);
      }
  }
    onLoad();
  },[fetchCart])

/**
 * Return if a product already is present in the cart
 *
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { String } productId
 *    Id of a product to be checked
 *
 * @returns { Boolean }
 *    Whether a product of given "productId" exists in the "items" array
 *
 */
const isItemInCart = (items, productId) => {
  // items is whole data array
  for(let i=0;i<items.length;i++){
      if(items[i]['_id']===productId){
        enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant:"warning"});
        return true;
      }
  }
  return false;
};

/**
 * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
 *
 * @param {string} token
 *    Authentication token returned on login
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { Array.<Product> } products
 *    Array of objects with complete data on all available products
 * @param {string} productId
 *    ID of the product that is to be added or updated in cart
 * @param {number} qty
 *    How many of the product should be in the cart
 * @param {boolean} options
 *    If this function was triggered from the product card's "Add to Cart" button
 *
 * Example for successful response from backend:
 * HTTP 200 - Updated list of cart items
 * [
 *      {
 *          "productId": "KCRwjF7lN97HnEaY",
 *          "qty": 3
 *      },
 *      {
 *          "productId": "BW0jAAeDJmlZCF8i",
 *          "qty": 1
 *      }
 * ]
 *
 * Example for failed response from backend:
 * HTTP 404 - On invalid productId
 * {
 *      "success": false,
 *      "message": "Product doesn't exist"
 * }
 */
const addToCart = async (token, items,products,productId,qty,options = { preventDuplicate: false }) => {

      if(options.preventDuplicate===true){
        try{
            let url=config.endpoint+'/cart';
            let res=await axios.post(url,{"productId":productId,"qty":qty},{headers:{Authorization:`Bearer ${token}`}});
            const cartData=await generateCartItemsFrom(res.data,products);
            updateCartData(cartData);
               if(token ){
        updateUserToken(token);
        const cartItems=await fetchCart(token);
        updateUserCartItems(cartItems);// Array of objects with productId and quantity of products in cart
        const cartData=await generateCartItemsFrom(cartItems,products);
        updateCartData(cartData);
      }

        }catch(e){
          console.log(e)
        }
      }
      else {
            // udpate only quantity
            // items.qty++
            let index;
            for(let i=0;i<items.length;i++){
              if(items[i]['productId']===productId){
                index=i;
              }
            }
            if(options.preventDuplicate==='handleAdd'){
              items[index]['qty']++;
            }
            else{
                items[index]['qty']--;
            }
            //  udpate items
            let url=config.endpoint+'/cart';
            let res=await axios.post(url,{"productId":productId,"qty":items[index]["qty"]},{headers:{Authorization:`Bearer ${token}`}});
            const cartData=await generateCartItemsFrom(res.data,products)
            updateCartData(cartData);
      }
};

// addItems 
let addItems=(e)=>{
  if (!userLoggedIn) {
    enqueueSnackbar("Login to add an item to the Cart", {
      variant: "warning"
    });
    return;
  }
  const result=isItemInCart(cartData,e.target.value)
    if(!result){
      addToCart(userToken,userCartItems,productData,e.target.value,1,{preventDuplicate: true});
    }else{
      enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant:"warning"});
    }
}
//Handle add and delete quantity
const onButtonClick=(id,qty,options={preventDuplicate: false})=>{
  console.log(id,qty,options);
// token, items,products,productId,qty,options = { preventDuplicate: false }
  addToCart(userToken,userCartItems,productData,id,qty,options);
};

const filterData = productData.filter((product) => {
    if (!activeTab || activeTab === "all") return true;
    const categoryMatch = product.category?.toLowerCase().match(activeTab.toLowerCase());
    const nameMatch = product.name?.toLowerCase().match(activeTab.toLowerCase());
    return categoryMatch || nameMatch;
  });

  return (
    <div>
      <Header  hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
    <FoodMenuTabs activeTab={activeTab} onSelectTab={setActiveTab} />
      </Header>

       <Grid container justifyContent="center" >
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
                <span className="hero-highlight">FASTEST Food DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>
      
      {
        isFetching?<div className={"loading"}>
                      <CircularProgress />
                      <h3>Loading Products</h3>
                    </div>
                  : !productNotFound?
                  <>
                  {
                    !userLoggedIn?
                   
                    <Grid container  sx={{ m: 3 }}>
                    <Grid container  spacing={{ xs: 2, md: 3 ,lg:1 }} >
                      {filterData.map((x)=>
                         (<Grid item lg={3} md={6} sm={6} xs={6} mt={2} mb={2} key={x['_id']}  >
                          <ProductCard product={x} handleAddToCart={(e)=>{addItems(e)}}/>
                        </Grid>
                        )
                        )}
                    </Grid>
                  </Grid>:
                
                        <Grid container spacing={2} sx={{ m: 3, width: "100%" }}  >
                        <Grid container item size={9} margin={2}  spacing={{ xs: 2, md: 3 ,lg:1 }} md={9}  >
                          {filterData.map((x)=>
                             (<Grid item lg={4} md={4} sm={6} xs={6} mt={2} mb={2} key={x['_id']}  >
                              <ProductCard product={x} handleAddToCart={(e)=>{addItems(e)}}/>
                            </Grid>
                            )
                            )}
                        </Grid>
                        <Grid alignItems="center" item size={3}  sm={12} xs={12} sx={{backgroundColor:'#E9F5E1'}} >
                           <Cart product={productData} items={cartData} handleQuantity={onButtonClick}  />
                           {/* handleQuantity={onButtonClick} */}

                        </Grid>
                      </Grid>
                  }
                  </>
                    :<div className={"loading"}>
                    <SentimentDissatisfied/>
                    <h3>No products found</h3>
                  </div>          
      }
      <Footer />
    </div>
  );
};

export default Products;
