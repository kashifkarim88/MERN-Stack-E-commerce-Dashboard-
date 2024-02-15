import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import AddProducts from './components/AddProducts';
import AllProducts from './components/AllProducts';
import ServerIssue from './components/ServerIssue';
import UpdateProduct from './components/UpdateProduct';
import Home from './components/Home';

function App() {
  return <>
    <div className="App">
      <BrowserRouter>
          <Header />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/productlist' element={<AllProducts />} />
          <Route path='/addproducts' element={<AddProducts />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/serverdown' element={<ServerIssue />} />
          <Route path='/editproduct/:id' element={<UpdateProduct />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  </>
}


export default App;
