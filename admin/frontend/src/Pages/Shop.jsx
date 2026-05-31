import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollectons from '../Components/NewCollectins/NewCollectons'
import NewsLetter from '../Components/NewsLetter/NewsLetter'

// FIX: ShopCategory yahan nahi chahiye — yeh apne route pe kaam karta hai
// /mens, /womens, /kids routes pe automatically sahi products dikhenge

const Shop = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offers/>
      <NewCollectons/>
      <NewsLetter/>
    </div>
  )
}

export default Shop
