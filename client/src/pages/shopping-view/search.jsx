import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";



function SearchProducts() {

  const [keyword, setKeyword] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {user} = useSelector((state)=> state.auth);
  const {productDetails} = useSelector((state)=> state.shopProducts);
  const {searchResults} = useSelector((state)=> state.shopSearch);
  const {cartItems} = useSelector((state)=> state.shopCart);
  const{toast} = useToast();
  const dispatch = useDispatch();
  let debounceTimer;

  function handleAddToCart(getCurrentProductId, getTotalStock) {
          console.log(cartItems, "cartItems");
          let getCartItems = cartItems.items || [];
  
          if(getCartItems.length) {
              const indexOfCurrentItem = getCartItems.findIndex((item)=> item.productId === getCurrentProductId);
              if(indexOfCurrentItem > -1) {
                  const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                  if(getQuantity + 1 > getTotalStock) {
                      toast({
                          title : `Only ${getQuantity} quantity can be added for this item`,
                          variant : "destructive"
                      });
                      return;
                  }
              }
              
          }
          dispatch(addToCart({userId : user?.id, productId : getCurrentProductId, quantity : 1})
          ).then((data)=> {
              if(data.payload?.success) {
                  dispatch(fetchCartItems(user?.id));
                  toast({
                      title : "Product is added to cart"
                  })
              }
          });
          
      }
  
  function handleGetProductDetails(getCurrentProductId) {
          dispatch(fetchProductDetails(getCurrentProductId));    
      }

  useEffect(() => {
    // Clear any previously set timeout to debounce
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    if (keyword && keyword.trim() !== '' && keyword.trim().length >= 3) {
        debounceTimer = setTimeout(() => {
          setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
          dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(resetSearchResults());
    }
    
    // Cleanup the timeout on component unmount or keyword change
    return () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
      };
    }, [keyword, dispatch]);

  useEffect(()=> {
    if(productDetails !== null) setOpenDetailsDialog(true)
  },[productDetails]);
  

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input value={keyword} 
          name="keyword" 
          onChange={(event)=> setKeyword(event.target.value)} className="py-6" placeholder="Search Products..."
          />
        </div>
      </div>
      {
        !searchResults.length ? (
          keyword === "" 
          ? <h1 className="text-5xl font-extrabold">Search products here!</h1>
          : <h1 className="text-5xl font-extrabold">No results found!</h1>
        ) : null
      }

      <div className="grid grid-cols-1 sm:gridcols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {
           searchResults.map((item)=> <ShoppingProductTile 
           handleAddToCart={handleAddToCart} 
           handleGetProductDetails={handleGetProductDetails} 
           product={item} 
           />)
        }
      </div>
      <ProductDetailsDialog 
      open={openDetailsDialog} 
      setOpen={setOpenDetailsDialog} 
      productDetails={productDetails} 
      />
    </div>
  )
}

export default SearchProducts;