import AdminOrdersView from "@/components/admin-view/orders";


function AdminOrders() {
    return(
        <div className='container mx-auto grid grid-cols-1 gap-8 py-8'>
            <AdminOrdersView />
        </div>
    );
}

export default AdminOrders;