import React from 'react';
import '../scss/footer.scss';

function Footer() {
  // Check if user is present in local storage
  const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
  const userName = userFromLocalStorage ? userFromLocalStorage.name : null;

  return (
    <div className="footer-wrapper">
      {
      userName ? <p className="footer-user-name">{userName}</p>:
      <p className='footer-user-name'>Login Please</p>
      }
    </div>
  );
}

export default Footer;
