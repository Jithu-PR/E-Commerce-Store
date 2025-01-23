import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";



function PaypalCancelPage() {

const navigate =useNavigate();

  return (
    <Card>
        <CardHeader>
            <CardTitle>Order has been canceled!</CardTitle>
        </CardHeader>
        <Button className="mt-5" onClick={()=> navigate("/shop/account")}>View Orders</Button>
    </Card>
  )
}

export default PaypalCancelPage;