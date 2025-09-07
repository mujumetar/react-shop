import './App.css';
import Navbars from './components/Navbar';
import Service from './components/Service';
import Footer from './components/Footer';
import Contactpage from './components/pages/Contactpage.jsx';
import Aboutpage from './components/pages/Aboutpage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Productpage from './components/pages/Productpage';
import Offerspage from './components/pages/offerspage';
import Home from './components/pages/Home.jsx';
import { useEffect, useState } from 'react';
import Eachprod from './components/pages/Eachprod.jsx';
import Loading from './components/Loading.jsx';
import Checkout from './components/Checkout.jsx';
import axios from 'axios'; // You forgot this import
import OrderSuccess from './components/pages/OrderSuccess.jsx';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({});
  const [isloading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/admin/api", formData);
      alert(res.data.message);
    } catch (err) {
      alert("Error adding product ❌");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/admin/api');
        const data = await res.json();
        setProducts(data.product);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false); // ✅ stop loading after data is fetched
      }
    };
    fetchData();
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
          <Eachprod />
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
          <Offerspage />
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
