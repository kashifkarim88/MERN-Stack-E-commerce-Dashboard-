import React, { useEffect, useState } from 'react'
import "../scss/login.scss"
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const navigate = useNavigate()

    useEffect(()=>{
        const auth = localStorage.getItem("user")
        if(auth){
            navigate("/productlist")
        }
    },[navigate])

    const userLogin=async()=>{
        await fetch("http://localhost:5000/login",{
            method:"POST",
            body:JSON.stringify({email:userEmail,password:userPassword}),
            headers:{
                authorization: JSON.parse(localStorage.getItem("token")),
                "content-type":"application/json"
            }
        }).then((responce)=>{
            if(responce.status === 400)
            {
                toast.warn("Please, provide both email and password.",{closeOnClick: true,})
            }
            else if(responce.status === 204){
                toast.warn("Invalid credientials.",{closeOnClick: true})
            }
            else if(responce.status === 403){
                toast.warn("Something went wrong, Please try latter",{closeOnClick: true})
            }
            else if(responce.status === 500){
                toast.warn("Internal server issues", {closeOnClick: true})
            }
            else if (responce.status === 200){
                responce.json().then((result)=>{
                    if(result.data.auth){
                        localStorage.setItem("user",JSON.stringify(result.data.userdata))
                        localStorage.setItem("token",JSON.stringify(result.data.auth))
                        navigate("/productlist")
                    }
                    else{
                        toast.warn("Please, enter correct details.")
                    }
                })
            }
        })
    }
    return <>
        <div className="login-wrapper">
            <div className="login-inner">
                <h2>Login.</h2>
                <input type="text" value={userEmail} placeholder='Email' onChange={(e)=> setUserEmail(e.target.value)}/>
                <input type="password" value={userPassword} placeholder='password' onChange={(e)=> setUserPassword(e.target.value)}/>
                <button className='login-btn' onClick={userLogin}>Login</button>
                <p className='signup-p' onClick={()=> navigate("/signup")}>dont't have account | <span className='Signup-link'>Signup</span></p>
            </div>
            <ToastContainer
                    position="top-center"
                    hideProgressBar={true}
                    autoClose={2000}
                    theme='dark'
                />
        </div>
    </>
}

export default Login