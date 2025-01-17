import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";


function AddressCard({addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId}) {
  
  return (
    <Card
    className={`cursor-pointer border-red-700 ${selectedId?._id === addressInfo?._id ? "border-red-900 border-[4px]" : "border-black"}`}
    onClick={
      setCurrentSelectedAddress 
      ? ()=>setCurrentSelectedAddress(addressInfo) 
      : null
      }>
        <CardContent className={`${selectedId === addressInfo?._id ? "border-black" : ""}grid p-4 gap-4`}>
            <Label>Address : {addressInfo?.address}</Label>
            <Label>City : {addressInfo?.city}</Label>
            <Label>Pincode : {addressInfo?.pincode}</Label>
            <Label>Phone : {addressInfo?.phone}</Label>
            {addressInfo?.notes !== "" ? <Label>Notes : {addressInfo?.notes}</Label> : null}
        </CardContent>
        <CardFooter className="flex justify-between p-3">
            <Button onClick={()=>handleEditAddress(addressInfo)}>Edit</Button>
            <Button onClick={()=>handleDeleteAddress(addressInfo)}>Delete</Button>
        </CardFooter>
    </Card>
  )
}

export default AddressCard;