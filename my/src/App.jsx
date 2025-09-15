import './App.css';
import Navbars from './components/Navbar';
import Service from './components/Service';
import Footer from './components/Footer';
import Contactpage from './components/pages/Contactpage.jsx';
import Aboutpage from './components/pages/Aboutpage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Productpage from './components/pages/Productpage';
// import Offerspage from './components/pages/offerspage';
import Home from './components/pages/Home.jsx';
import { useEffect, useState } from 'react';
import Eachprod from './components/pages/Eachprod.jsx';
import Loading from './components/Loading.jsx';
import Checkout from './components/Checkout.jsx';
import axios from 'axios'; // You forgot this import
import OrderSuccess from './components/pages/OrderSuccess.jsx';
import ProductData from "./components/Products.json"

import Gallery from "./components/pages/Gallery.jsx"

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({});
  const [isloading, setIsLoading] = useState(true);


  useEffect(() => {

    setTimeout(() => {
      setProducts(ProductData);
      setIsLoading(false);
    }, 1000);
  }, []);



  if (isloading) {
    return <Loading />; // ✅ Show loading while fetching
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbars />
          {/* <Eachprod /> */}
          {/* <Checkout /> */}
          <Home products={products} />
          <Footer />
        </>
      ),
    },
    {
      path: "/order-success",
      element: (
        <>
          <Navbars />
          <OrderSuccess />
          {/* <Footer /> */}
        </>
      ),
    },
    {
      path: "/products",
      element: (
        <>
          <Navbars />
          <Productpage products={products} />
          <Footer />
        </>
      ),
    },
    {
      path: "/contact",
      element: (
        <>
          <Navbars />
          <Contactpage />
          <Footer />
        </>
      ),
    },
    {
      path: "/services",
      element: (
        <>
          <Navbars />
          <Service />
          <Footer />
        </>
      ),
    },
    {
      path: "/offers",
      element: (
        <>
          <Navbars />
          {/* <Offerspage /> */}
          <Footer />
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <Navbars />
          <Aboutpage />
          <Footer />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
