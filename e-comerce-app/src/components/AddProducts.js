import React, { useState } from 'react'
import "../scss/addproducts.scss"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddProducts() {
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productType, setProductType] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const userId = JSON.parse(localStorage.getItem("user"))._id;

    const addProducts = async () => {
        await fetch("http://localhost:5000/addproducts", {
            method: "POST",
            body: JSON.stringify({
                product_name: productName,
                product_description: productDescription,
                product_brand: productBrand,
                product_type: productType,
                product_category: productCategory,
                product_quantity: productQuantity,
                product_price: productPrice,
                user_id:userId
            }),
            headers: {
                'content-type': "application/json",
                authorization: JSON.parse(localStorage.getItem("token"))
            }
        }).then((responce) => {
            if (responce.status === 400) {
                toast.error("Invalid Credientials, Please fill the form carefully..",{closeOnClick:true})
            }
            else if (responce.status === 500) {
                toast.error("Internal Server issues.")
            }
            else if (responce.status === 200) {
                responce.json().then((results) => {
                    console.log(results.data)
                    toast.success("product added successfully",{closeOnClick: true})
                    setProductName("")
                    setProductDescription("")
                    setProductBrand("")
                    setProductType("")
                    setProductCategory("")
                    setProductQuantity("")
                    setProductPrice("")
                })
            }
        })


    }
    return <>
        <div className="add-products-wrapper">
            <div className="add-products-inner">
                <h2>Add Products</h2>
                <input className='add-prodcuts-input' value={productName} type="text" placeholder='product name' onChange={(e) => setProductName(e.target.value)} />
                <input className='add-prodcuts-input' value={productDescription} type="text" placeholder='description' onChange={(e) => setProductDescription(e.target.value)} />
                <input className='add-prodcuts-input' value={productBrand} type="text" placeholder='brand' onChange={(e) => setProductBrand(e.target.value)} />
                <input className='add-prodcuts-input' value={productType} type="text" placeholder='type' onChange={(e) => setProductType(e.target.value)} />
                <input className='add-prodcuts-input' value={productCategory} type="text" placeholder='category' onChange={(e) => setProductCategory(e.target.value)} />
                <input className='add-prodcuts-input' value={productQuantity} type="number" placeholder='quantity' onChange={(e) => setProductQuantity(e.target.value)} />
                <input className='add-prodcuts-input' value={productPrice} type="number" placeholder='price' onChange={(e) => setProductPrice(e.target.value)} />
                <button className='add-product-btn' onClick={addProducts}>Add Product</button>
                <ToastContainer
                position="top-center"
                autoClose={2000}/>
            </div>
        </div>
    </>
}

export default AddProducts