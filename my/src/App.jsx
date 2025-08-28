import { useState } from 'react'
import './App.css'

import Navbars from './components/Navbar'
import Slider from './components/Slider'
import Offersect from './components/Offersect'
import Aboutsect from './components/Aboutsect'
import Productcard from './components/Productcard'
import Service from './components/Service'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbars/>
      <Slider/>
      <Offersect/>
      <Aboutsect/>
      <Productcard/>
      <Service/>
      <Footer/>
    </>
  )
}

export default App
