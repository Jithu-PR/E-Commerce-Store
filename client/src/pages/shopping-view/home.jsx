import { Button } from "@/components/ui/button";
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, Footprints, Gem, ShirtIcon, WatchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import nikelogo from "../../assets/nike-logo.png";
import adidaslogo from "../../assets/adidas-originals-logo.png";
import pumalogo from "../../assets/puma-logo.png";
import levislogo from "../../assets/Levi's-logo.jpg";
import zaralogo from "../../assets/zara-logo.png";
import hmlogo from "../../assets/hm-logo.png"

const categoriesWithIcon = [
    {id : "men", label : "Men", icon : ShirtIcon},
    {id : "women", label : "Women", icon : Gem},
    {id : "kids", label : "Kids", icon : BabyIcon},
    {id : "accessories", label : "Accessories", icon : WatchIcon},
    {id : "footwear", label : "Footwear", icon : Footprints},
];

const brandsWithIcon = [
    { id : "nike", label : "Nike", logo : nikelogo },
    { id : "adidas", label : "Adidas", logo : adidaslogo },
    { id : "puma", label : "Puma", logo : pumalogo },
    { id : "levi", label : "Levi's", logo : levislogo },
    { id : "zara", label : "Zara", logo : zaralogo },
    { id : "h&m", label : "H&M", logo : hmlogo },
];


function ShoppingHome() {

    const [currentSlide, setCurrentSlide] = useState(0);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const {productList, productDetails} = useSelector((state)=> state.shopProducts);
    const {user} = useSelector((state)=> state.auth);
    const {featureImageList} = useSelector((state)=> state.commonFeature);
    const dispatch =  useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section] : [getCurrentItem.id],
        };
        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
        navigate(`/shop/listing`);
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
        
    }

    function handleAddToCart(getCurrentProductId) {
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
    

    useEffect(()=> {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide)=> (prevSlide + 1)% featureImageList.length)
        }, 3000);
        return ()=> clearInterval(timer);
    },[featureImageList]);

    useEffect(() => {
      dispatch(fetchAllFilteredProducts({filterParams : {}, sortParams : "price-lowtohigh"}));
    }, [dispatch]);

    useEffect(()=> {
        if(productDetails !== null) setOpenDetailsDialog(true)
    },[productDetails]);

    useEffect(() => {
        console.log(featureImageList,"img list");
        
        dispatch(getFeatureImages());
    }, [dispatch]);

    

    return(
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                {
                    featureImageList && featureImageList.length > 0 
                    ? featureImageList.map((slide, index)=> 
                    <img
                    src={slide?.image}
                    key={index}
                    className={`${index === currentSlide ? "opacity-100" : "opacity-0"} 
                    absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                    />)
                    : null
                }
                <Button 
                onClick={()=>setCurrentSlide((prevSlide)=> (prevSlide - 1 + featureImageList.length) % featureImageList.length)}
                variant="outline" 
                size="icon" 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button 
                onClick={()=>setCurrentSlide((prevSlide)=> (prevSlide + 1) % featureImageList.length)}
                variant="outline" 
                size="icon" 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {
                            categoriesWithIcon.map((categoryItem)=> 
                            <Card onClick={()=> handleNavigateToListingPage(categoryItem, "category")} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <categoryItem.icon className="w-12 h-12 text-primary" />
                                    <span className="font-bold">{categoryItem.label}</span>
                                </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {
                            brandsWithIcon.map((brandItem)=> 
                            <Card onClick={()=> handleNavigateToListingPage(brandItem, "brand")} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <img className="w-20 h-25"
                                    src={brandItem.logo}
                                    />
                                </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>
            <section className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                    productList && productList.length > 0 ? 
                    productList.slice(0,4).map((productItem)=> 
                    <ShoppingProductTile 
                    handleGetProductDetails={handleGetProductDetails} 
                    handleAddToCart={handleAddToCart} 
                    product={productItem} 
                    />) 
                    : null
                }
            </div>
            </section>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    );
}

export default ShoppingHome;