
import './App.css'
import Navbars from './components/Navbar'
import Slider from './components/Slider'
import Offersect from './components/Offersect'
import Aboutsect from './components/Aboutsect'
import Productcard from './components/Productcard'
import Service from './components/Service'
import Footer from './components/Footer'
import Contactpage from './components/pages/Contactpage'
import Contact from './components/Contact'
import Aboutpage from './components/pages/Aboutpage'



function App() {


  {
    // Countdown timer
    function updateCountdown() {
      const countdownItems = document.querySelectorAll('.countdown-number');
      let days = parseInt(countdownItems[0].textContent);
      let hours = parseInt(countdownItems[1].textContent);
      let minutes = parseInt(countdownItems[2].textContent);
      let seconds = parseInt(countdownItems[3].textContent);

      seconds--;

      if (seconds < 0) {
        seconds = 59;
        minutes--;

        if (minutes < 0) {
          minutes = 59;
          hours--;

          if (hours < 0) {
            hours = 23;
            days--;

            if (days < 0) {
              // Countdown finished
              days = 0;
              hours = 0;
              minutes = 0;
              seconds = 0;
            }
          }
        }
      }

      countdownItems[0].textContent = days.toString().padStart(2, '0');
      countdownItems[1].textContent = hours.toString().padStart(2, '0');
      countdownItems[2].textContent = minutes.toString().padStart(2, '0');
      countdownItems[3].textContent = seconds.toString().padStart(2, '0');
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);

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

  return (
    <>

      {/* <Routes>

        <Route path="/" element={<Contactpage />}
      
    </Routes> */}
      <Navbars />
      <Slider />
      {/* <Offersect /> */}
      <Aboutsect />
      <Productcard />
      <Service />

      {/* <Aboutpage/> */}
      <Contact />
      <Footer />
    </>
  )
}

export default App
