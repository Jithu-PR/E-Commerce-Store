import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteOrder } from '@/store/shop/order-slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PaypalCancelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
    dispatch(deleteOrder(orderId));
    sessionStorage.removeItem('currentOrderId');
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order has been canceled!</CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate('/shop/account')}>
        View Orders
      </Button>
    </Card>
  );
}

export default PaypalCancelPage;
