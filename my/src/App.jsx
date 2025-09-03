
import './App.css'
import Navbars from './components/Navbar'
import Service from './components/Service'
import Footer from './components/Footer'
import Contactpage from './components/pages/Contactpage.jsx'
import Aboutpage from './components/pages/Aboutpage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Productpage from './components/pages/Productpage'
import Offerspage from './components/pages/offerspage'
import Home from './components/pages/Home.jsx'
import { useEffect } from 'react'
import Eachprod from './components/pages/Eachprod.jsx'



function App() {


  {
    // // Countdown timer
    // function updateCountdown() {
    //   const countdownItems = document.querySelectorAll('.countdown-number');
    //   let days = parseInt(countdownItems[0].textContent);
    //   let hours = parseInt(countdownItems[1].textContent);
    //   let minutes = parseInt(countdownItems[2].textContent);
    //   let seconds = parseInt(countdownItems[3].textContent);

    //   seconds--;

    //   if (seconds < 0) {
    //     seconds = 59;
    //     minutes--;

    //     if (minutes < 0) {
    //       minutes = 59;
    //       hours--;

    //       if (hours < 0) {
    //         hours = 23;
    //         days--;

    //         if (days < 0) {
    //           // Countdown finished
    //           days = 0;
    //           hours = 0;
    //           minutes = 0;
    //           seconds = 0;
    //         }
    //       }
    //     }
    //   }

    //   countdownItems[0].textContent = days.toString().padStart(2, '0');
    //   countdownItems[1].textContent = hours.toString().padStart(2, '0');
    //   countdownItems[2].textContent = minutes.toString().padStart(2, '0');
    //   countdownItems[3].textContent = seconds.toString().padStart(2, '0');
    // }

    // // Update countdown every second
    // setInterval(updateCountdown, 1000);

    // Animation on scroll
    document.addEventListener('DOMContentLoaded', function () {
      const animatedItems = document.querySelectorAll('.product-card, .popular-product');

      function checkScroll() {
        animatedItems.forEach(item => {
          const itemTop = item.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;

          if (itemTop < windowHeight - 100) {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0)';
          }
        });
      }

      // Initialize items as hidden
      animatedItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });

      // Check scroll on load and on scroll
      checkScroll();
      window.addEventListener('scroll', checkScroll);
    });
  }




  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3000/test')
      const data = await res.json()
      console.log(data)
    }
    fetchData()
  }, [])

  return (
    <>

      <Router>
        <Navbars />  
        {/* <Eachprod/> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Productpage />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/services" element={<Service />} />
          <Route path="/contact" element={<Contactpage />} />
          <Route path="/offers" element={<Offerspage />} />
        </Routes>
        <Footer />
      
      </Router>


    </>
  )
}

export default App
