import React, { useEffect, useState, useCallback } from 'react';
import Product from './Product';
import '../scss/allproducts.scss';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';

function AllProducts() {
    const [productList, setProductList] = useState([]);
    const [productId, setProductId] = useState("")
    const [toggle, setToggle] = useState(false)
    const [searchProd, setSearchProduct] = useState("")
    const navigate = useNavigate("")

    const fetchProductData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/allproductslist', {
                headers: {
                    authorization: JSON.parse(localStorage.getItem("token"))
                }
            });
            const results = await response.json();
            if (results.data.length > 0) {
                setToggle(true);
                setProductList(results.data);
            } else {
                console.log("empty");
                setToggle(false);
            }
        } catch (error) {
            navigate("/serverdown");
        }
    }, [navigate]);
    useEffect(() => {
        fetchProductData();
    }, [productId, fetchProductData]);

    
    const searchHandler = async (event) => {
        let key = event.target.value
        setSearchProduct(key)
        if(key){
            await fetch(`http://localhost:5000/search/${key}`)
            .then((responce) => {
                if (responce.status === 500) {
                    navigate("/serverdown")
                }
                else if (responce.status === 400) {
                    setProductList([])
                    setToggle(false)
                }
                else if (responce.status === 201) {
                    responce.json().then((results) => {
                        setProductList(results.data)
                    }
                    )
                }
            })
        }
        else{
            fetchProductData();
        }
    }
    const clearSearch = () => {
        setSearchProduct("");
        fetchProductData();
    }
    return (
        <>
            <div className="all-products-wrapper">
                <h2>All Products</h2>
                <div className="search_product_div">
                    <div className="search_prodct_inner">
                        <input type="text" className='search_product' value={searchProd} placeholder='Search Product' onChange={searchHandler} />
                        {
                            searchProd ?
                                <CloseIcon
                                    style={{ color: 'rgba(184, 184, 184, 0.9)', width: "20px", height: "20px" }}
                                    className='close_icon'
                                    onClick={clearSearch} /> : ""
                        }
                    </div>
                </div>
                {
                    toggle ? (
                        <div className="all-products-inner">
                            <Product productData={productList} productId={setProductId} />
                        </div>
                    ) :
                        <p>No Item Found</p>
                }
            </div>
        </>
    );
}

export default AllProducts;
