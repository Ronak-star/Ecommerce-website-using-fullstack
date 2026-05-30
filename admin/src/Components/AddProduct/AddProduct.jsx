/*

import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

  const [image, setImage] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  // Image Handler
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // Input Change Handler
  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  // Add Product Function
  const Add_Product = async () => {

    console.log(productDetails);

    let responseData;

    let product = {
      ...productDetails
    };

    let formData = new FormData();

    formData.append('product', image);

    // Upload Image
    await fetch('https://ecommerce-website-using-fullstack-backend.onrender.com', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });

    // Check Upload Success
    if (responseData.success) {

      product.image = responseData.image_url;

      console.log(product);

      // Add Product API
      await fetch('https://ecommerce-website-using-fullstack-backend.onrender.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {

          if (data.success) {
            alert("Product Added");
          } else {
            alert("Failed");
          }

        });
    }
  };

  return (
    <div className='add-product'>

      {/* Product Title *///}
      /*
      <div className='addproduct-itemfield'>
        <p>Product Title</p>

        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name='name'
          placeholder='Type here'
          autoComplete='off'
        />
      </div>

      {/* Prices *}*/
      /*
      <div className='addproduct-price'>

        <div className='addproduct-itemfield'>
          <p>Price</p>

          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type='text'
            name="old_price"
            placeholder='Type here'
            autoComplete='off'
          />
        </div>

        <div className='addproduct-itemfield'>
          <p>Offer Price</p>

          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type='text'
            name="new_price"
            placeholder='Type here'
            autoComplete='off'
          />
        </div>

      </div>

      {/* Category *}*/
      /*
      <div className='addproduct-itemfield'>
        <p>Product Category</p>

        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

     // {/* Image Upload *//*/
     /*
      <div className='addproduct-itemfield'>

        <label htmlFor='file-input'>
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className='addproduct-thumnail-img'
            alt=""
          />
        </label>

        <input
          onChange={imageHandler}
          type="file"
          name='image'
          id='file-input'
          hidden
        />
      </div>

      {/* Button *
      <button
        onClick={Add_Product}
        className='addproduct-btn'
      >
        ADD
      </button>

    </div>
  )
}

export default AddProduct
*/

import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const BACKEND_URL = "https://ecommerce-website-using-fullstack-backend.onrender.com";

const AddProduct = () => {

  const [image, setImage] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  const Add_Product = async () => {
    console.log(productDetails);

    let responseData;
    let product = { ...productDetails };

    let formData = new FormData();
    formData.append('product', image);

    // FIX: /upload route add kiya
    await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => { responseData = data; });

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);

      // FIX: /addproduct route add kiya
      await fetch(`${BACKEND_URL}/addproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            alert("Product Added");
          } else {
            alert("Failed");
          }
        });
    }
  };

  return (
    <div className='add-product'>

      <div className='addproduct-itemfield'>
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' autoComplete='off' />
      </div>

      <div className='addproduct-price'>
        <div className='addproduct-itemfield'>
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type='text' name="old_price" placeholder='Type here' autoComplete='off' />
        </div>
        <div className='addproduct-itemfield'>
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type='text' name="new_price" placeholder='Type here' autoComplete='off' />
        </div>
      </div>

      <div className='addproduct-itemfield'>
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className='addproduct-itemfield'>
        <label htmlFor='file-input'>
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>

      <button onClick={Add_Product} className='addproduct-btn'>ADD</button>

    </div>
  )
}

export default AddProduct

