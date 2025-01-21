import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    productList : [],

};

export const addNewProduct = createAsyncThunk('/products/addnewproduct', 
    async (formData)=>{
        const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/add`, formData, {
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        return result?.data;
});

export const fetchAllProducts = createAsyncThunk('/products/fetchallproducts', 
    async (formData)=>{
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`);
        return result?.data;
});

export const editProduct = createAsyncThunk('/products/editproduct', 
    async ({id, formData})=>{
        const result = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`, formData, {
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        return result?.data;
});

export const deleteProduct = createAsyncThunk('/products/deleteproduct', 
    async (id)=>{
        const result = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`);
        return result?.data;
});

const adminProductsSlice = createSlice({
    name : "adminProduct",
    initialState,
    reducers : {},
        extraReducers : (builder)=> {
            builder.addCase(fetchAllProducts.pending, (state)=>{
                state.isLoading = true;
            }).addCase(fetchAllProducts.fulfilled, (state, action)=>{
                console.log("fetch fullfilled");
                state.isLoading = false;
                state.productList = action.payload.data;
            }).addCase(fetchAllProducts.rejected, (state, action)=>{
                console.log("fetch rejected", action.error);
                state.error = action.error.message || 'Failed to fetch products';
                state.isLoading = false;
                state.productList = [];
            })
        },
});

export default adminProductsSlice.reducer;