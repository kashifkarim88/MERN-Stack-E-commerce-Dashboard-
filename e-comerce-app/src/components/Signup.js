import React, { useEffect, useState } from 'react';
import "../scss/signup.scss";
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Signup() {
    const [Name, setSignupUserName] = useState("");
    const [Email, setSignupUserEmail] = useState("");
    const [Phone, setSignupUserPhone] = useState("");
    const [Password, setSignupUserPassword] = useState("");
    const [ConfirmPassword, setSignupUserConfirmPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate("/productlist");
        }
    }, [navigate])

    const userSignup = () => {
        if (Name === "" || Email === "" || Phone === "" || Password === "" || ConfirmPassword === "") {

            alert("Please, Fill the form")
        }
        else if (Password !== ConfirmPassword) {
            alert("Password and Confirm Password doesn't match.")
        }
        else {
            sendData(Name, Email, Phone, Password);
        }
    };

    async function sendData(Name, Email, Phone, Password) {
        await fetch("http://localhost:5000/signup", {
            method: "POST",
            body: JSON.stringify({ name: Name, email: Email, phone: Phone, password: Password }),
            headers: {
                "content-type": "application/json"
            }
        }).then((responce) => {
            const respStatus = responce.status;
            console.log(respStatus)
            if (respStatus === 409) {
                toast.warn(`user with Email: ${Email} already exists.`,{closeOnClick: true,})
            }
            else if (respStatus === 400) {
                toast.warn("Please provide both email and password.",{closeOnClick: true,})
            }
            else if (respStatus === 500) {
                toast.error("Internal Server issues.",{closeOnClick: true,})
            }
            else {
                responce.json().then((results) => {
                    if (results) {
                        setSignupUserName("")
                        setSignupUserEmail("")
                        setSignupUserPhone("")
                        setSignupUserPassword("")
                        setSignupUserConfirmPassword("")
                        toast(`${Name} has created successfully...`)
                        navigate('/login')
                    }
                })
            }
        })
    }

    return (
        <div className="signup-wrapper">
            <div className="signup-inner">
                <h2>Signup.</h2>
                <input type="text" value={Name} placeholder='user name' onChange={(e) => setSignupUserName(e.target.value)} />
                <input type="email" value={Email} placeholder='email' onChange={(e) => setSignupUserEmail(e.target.value)} />
                <input type="text" value={Phone} placeholder='phone number' onChange={(e) => setSignupUserPhone(e.target.value)} />
                <input type="password" value={Password} placeholder='password' onChange={(e) => setSignupUserPassword(e.target.value)} />
                <input type="password" value={ConfirmPassword} placeholder='confirm password' onChange={(e) => setSignupUserConfirmPassword(e.target.value)} />
                <button className='Signup-btn' onClick={userSignup}>Signup</button>
                <ToastContainer
                    position="top-center"
                    hideProgressBar={true}
                    autoClose={2000}
                    theme='dark'
                />
            </div>
        </div>
    );
}

export default Signup;
