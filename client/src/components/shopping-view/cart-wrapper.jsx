import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import UserCartItemsContend from './cart-items-content';

function UserCartWrapper({ cartItems, setOpenCartSheet, setOpenContentSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0,
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => <UserCartItemsContend cartItem={item} />)
        ) : (
          <span>Cart is empty!</span>
        )}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      {cartItems && cartItems.length === 0 ? (
        <Button
          onClick={() => {
            navigate('/shop/listing');
            setOpenCartSheet(false);
            setOpenContentSheet(false);
          }}
          className="w-full mt-6"
        >
          Add products
        </Button>
      ) : (
        <Button
          onClick={() => {
            navigate('/shop/checkout');
            setOpenCartSheet(false);
            setOpenContentSheet(false);
          }}
          className="w-full mt-6"
        >
          Checkout
        </Button>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
