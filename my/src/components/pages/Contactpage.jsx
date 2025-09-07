import React from 'react'
import Navbars from '../Navbar'
import Footer from '../Footer'
import Contact from '../Contact'
import Slider from '../Slider'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


const Contactpage = () => {
    return (
        <>
            {/* <Navbars /> */}
            {/* <Slider/> */}
            <div className='d-flex justify-content-center align-items-center'>
                <DotLottieReact
                    src="https://lottie.host/65e02c01-5203-4f57-9b42-16ee9254be66/PCQtTKZaxm.lottie"
                    loop
                    autoplay

                    style={{ width: "500px"}}
                />
            </div>
                <Contact />
            {/* <Footer/> */}
        </>
    )
}

export default Contactpage