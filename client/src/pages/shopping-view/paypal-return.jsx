import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";




function PaypalReturnPage() {

    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");

    useEffect(() => {
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    
            // Attempt to capture the payment
            dispatch(capturePayment({ paymentId, payerId, orderId }))
                .then((data) => {
                    if (data?.payload?.success) {
                        // If payment is successful
                        sessionStorage.removeItem("currentOrderId");
                        window.location.href = "/shop/payment-success";
                    } else {
                        // If payment failed or something else went wrong
                        console.error("Payment capture failed:", data?.payload?.error);
                        window.location.href = "/shop/paypal-cancel";
                    }
                })
                .catch((error) => {
                    // Handle unexpected errors during payment capture
                    console.error("Payment capture error:", error);
                    window.location.href = "/shop/paypal-cancel";
                });
        } else {
            // If there are no paymentId or payerId (maybe canceled)
            window.location.href = "/shop/paypal-cancel"; // Redirect to a payment canceled page
        }
    }, [paymentId, payerId, dispatch]);
    
    

  return (
    <Card>
        <CardHeader>
            <CardTitle>Processing Payment... Please wait!</CardTitle>
        </CardHeader>
    </Card>
  )
}

export default PaypalReturnPage;