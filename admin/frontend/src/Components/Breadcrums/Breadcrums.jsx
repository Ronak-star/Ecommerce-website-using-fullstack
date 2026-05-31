import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrums = ({ product }) => {

  return (
    <div className='breadcrums'>

      <span>HOME</span>
      <img src={arrow_icon} alt="" />

      <span>SHOP</span>
      <img src={arrow_icon} alt="" />

      <span>{product?.category}</span>
      <img src={arrow_icon} alt="" />

      <span>{product?.name}</span>

    </div>
  )
}

export default Breadcrums