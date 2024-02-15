import React from 'react';
import "../scss/products.scss";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';

function Product({ productData, productId }) {
  const navigate = useNavigate("")
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/deleteproduct/${id}`, {
        method: "DELETE",
        headers:{
          authorization: JSON.parse(localStorage.getItem("token"))
        }
      })
        .then((responce) => {
          if (responce.status === 500) {
            productId("");
            toast.error("Internal server issues");
          } else if (responce.status === 201) {
            responce.json().then((results) => {
              if (results) {
                if (productId) {
                  productId(id);
                }
              }
            })
          }
        })
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product', { closeOnClick: true });
    }
  }


  return (
    <>
      <div className="product_wrapper">
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((data, index) => {
              return (
                <tr key={data._id}>
                  <td>{index + 1}</td>
                  <td>{data.product_name}</td>
                  <td>{data.product_description}</td>
                  <td>{data.product_brand}</td>
                  <td>{data.product_type}</td>
                  <td>{data.product_category}</td>
                  <td>{data.product_quantity}</td>
                  <td>{data.product_price}</td>
                  <td><EditIcon style={{ color: 'rgb(0, 153, 255)' }} onClick={() => navigate(`/editproduct/${data._id}`)} /></td>
                  <td><DeleteIcon onClick={() => deleteProduct(data._id)} style={{ color: 'red' }} /></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <ToastContainer
          position="top-center"
          autoClose={2000} />
      </div>
    </>
  );
}

export default Product;
