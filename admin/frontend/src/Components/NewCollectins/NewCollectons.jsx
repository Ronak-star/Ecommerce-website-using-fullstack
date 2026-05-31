import React, { useEffect, useState } from 'react'
import './NewCollectons.css'
//import new_collecion from '../Assets/new_collections'
import Item from '../Item/Item'

const NewCollectons = () => {
  const [new_collecion,setNew_collection] = useState([]);

  useEffect(()=>{
    fetch('https://ecommerce-website-using-fullstack-lwrn.onrender.com')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));
  },[])
  return (

    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className='collections'>
        {new_collecion.map((item,i)=>{
        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
})}
      </div>
      
      
    </div>
  )
}

export default NewCollectons
