import React from 'react'
import Slider from '../Slider'
import Aboutsect from '../Aboutsect'
import Productcard from '../Productcard'
import Service from '../Service'
import Contact from '../Contact'
import Qna from '../Qna'

const Home = ({products}) => {
    // console.log(products)
    return (
        <>
            <Slider />
            <Productcard products={products}/>
            {/* <Service/> */}
            <Qna/>
            <Aboutsect/>
            <Contact/>
        </>
    )
}

export default Home