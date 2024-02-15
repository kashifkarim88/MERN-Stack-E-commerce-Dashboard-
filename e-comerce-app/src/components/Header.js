import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../scss/header.scss';

function Header() {
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const logOut = () => {
    localStorage.clear();
    setIsLoggedOut(true);
  }
  if (isLoggedOut) {
    setIsLoggedOut(false);
    navigate('/login')
  }

  return (
    <>
      <div className="header-wrapper-main">
        <h1 className='header-heading-1'>Header</h1>
        <ul>
          <li><NavLink className={'navLinks'} to={'/'}>Home</NavLink></li>
          <li><NavLink className={'navLinks'} to={'/productlist'}>Products List</NavLink></li>
          <li><NavLink className={'navLinks'} to={'/addproducts'}>Add Products</NavLink></li>
          {
            localStorage.getItem("user") ?
              <li><button className={'logOutBtn'} onClick={logOut}>Logout</button></li> :
              <li><button className={'loginBtn'} onClick={() => navigate("/login")}>Login</button></li>
          }
        </ul>
      </div>
    </>
  );
}

export default Header;
