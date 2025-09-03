import React from 'react'
import Slider from '../Slider'
import Productcard from '../Productcard'

const Productpage = ({products}) => {
  return (
    <>
    <Slider/>
    <Productcard products={products}/>
    </>
  )
}

export default Productpage