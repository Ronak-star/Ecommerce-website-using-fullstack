/*import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts, setAllProducts] = useState([]);

  // Fetch Products
  const fetchInfo = async () => {
    try {
      const response = await fetch('https://ecommerce-website-using-fullstack-backend.onrender.com');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {

  await fetch('https://ecommerce-website-using-fullstack-backend.onrender.com', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ id: id }),
  });
  await fetchInfo();

}

  return (
    <div className='list-product'>

      <h1>All Products List</h1>


      <div className='listproduct-format-main'>
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">

        <hr />


        {allproducts.map((product, index) => {
          return (
            <React.Fragment key={index}>

              <div className="listproduct-format-main listproduct-format">

                <img
                  src={product.image}
                  alt=""
                  className='listproduct-product-icon'
                />

                <p>{product.name}</p>

                <p>${product.old_price}</p>

                <p>${product.new_price}</p>

                <p>{product.category}</p>

                <img onClick={()=> {remove_product(product.id)}}
                  className='listproduct-remove-icon'
                  src={cross_icon}
                  alt=""
                />

              </div>

              <hr />

            </React.Fragment>
          )
        })}

      </div>

    </div>
  )
}

export default ListProduct
*/


import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const BACKEND_URL = "https://ecommerce-website-using-fullstack-backend.onrender.com";

const ListProduct = () => {

  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      // FIX: /allproducts route add kiya
      const response = await fetch(`${BACKEND_URL}/allproducts`);
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    // FIX: /removeproduct route add kiya
    await fetch(`${BACKEND_URL}/removeproduct`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>

      <div className='listproduct-format-main'>
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <React.Fragment key={index}>
              <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt="" className='listproduct-product-icon' />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon' src={cross_icon} alt="" />
              </div>
              <hr />
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ListProduct
