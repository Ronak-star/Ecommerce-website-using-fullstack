import React, { useEffect, useState } from 'react'
import'./Popular.css'
//import data_product from '../Assets/data'
import Item from '../Item/Item'
const Popular = () => {
  const [PopularProducts,setPopularProducts] = useState([]);

  useEffect(()=>{
    const BACKEND_URL = "https://ecommerce-website-using-fullstack-lwrn.onrender.com";
fetch(`${BACKEND_URL}/popularinwomen`)
    .then((response)=>response.json())
    .then((data)=>setPopularProducts(data));
  },[])
  return (
    <div className='Popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr/>
      <div className='Popular-item'>
        {PopularProducts.map((item,i)=>{
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>

      
    </div>
  )
}

export default Popular
