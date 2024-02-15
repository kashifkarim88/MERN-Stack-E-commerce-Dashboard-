import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import "../scss/updateproducts.scss"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function UpdateProduct() {
    const { id } = useParams();
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productType, setProductType] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    const navigate = useNavigate("")

    useEffect(() => {
        const fetchData= async()=> {
            await fetch(`http://localhost:5000/getproduct/${id}`,{
                headers:{
                    authorization: JSON.parse(localStorage.getItem("token"))
                }
            }
            )
                .then((responce) => {
                    if (responce.status === 400) {
                        toast.error("Product not found")
                    }
                    else if(responce.status === 500){
                        navigate("/serverdown")
                    }
                    else if(responce.status === 201){
                        responce.json().then((results)=>{
                            if(results.data.length > 0){
                                results.data.forEach((data,index)=>{
                                    setProductName(data.product_name)
                                    setProductDescription(data.product_description)
                                    setProductBrand(data.product_brand)
                                    setProductType(data.product_type)
                                    setProductCategory(data.product_category)
                                    setProductQuantity(data.product_quantity)
                                    setProductPrice(data.product_price)
                                })
                            }
                        })
                    }
                    else{
                        console.log("something went wrong")
                    }
                }
                )
        }
    
        fetchData();
    },[id,navigate])
    
    const updateData = async()=>{
        console.log('updateData')
        await fetch(`http://localhost:5000/editproduct/${id}`,{
            method:"PUT",
            headers:{
                "content-type":"application/json",
                authorization: JSON.parse(localStorage.getItem("token")),
            },
            body:JSON.stringify({
                product_name: productName,
                product_description: productDescription,
                product_brand: productBrand,
                product_type: productType,
                product_category: productCategory,
                product_quantity: productQuantity,
                product_price: productPrice,
                user_id:userId
            })
        }).then((responce)=>{
            if(responce.status === 400){
                toast.error("Invalid credientails",{closeOnClick:true})
            }
            else if(responce.status === 500){
                navigate("/serverdown")
            }
            else if(responce.status === 201){
                console.log(responce.json())
                navigate("/productlist")
            }
        })
    }
    return <>
        <div className="update-wrapper">
            <div className="update-inner">
                <h2>Add Products</h2>
                <input className='edit-prodcuts-input' value={productName} type="text" placeholder='product name' onChange={(e) => setProductName(e.target.value)} />
                <input className='edit-prodcuts-input' value={productDescription} type="text" placeholder='description' onChange={(e) => setProductDescription(e.target.value)} />
                <input className='edit-prodcuts-input' value={productBrand} type="text" placeholder='brand' onChange={(e) => setProductBrand(e.target.value)} />
                <input className='edit-prodcuts-input' value={productType} type="text" placeholder='type' onChange={(e) => setProductType(e.target.value)} />
                <input className='edit-prodcuts-input' value={productCategory} type="text" placeholder='category' onChange={(e) => setProductCategory(e.target.value)} />
                <input className='edit-prodcuts-input' value={productQuantity} type="number" placeholder='quantity' onChange={(e) => setProductQuantity(e.target.value)} />
                <input className='edit-prodcuts-input' value={productPrice} type="number" placeholder='price' onChange={(e) => setProductPrice(e.target.value)} />
                <button className='edit-btn' onClick={updateData}>Edit Product</button>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000} />
        </div>
    </>
}

export default UpdateProduct