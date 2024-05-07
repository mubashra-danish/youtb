import React from 'react'

const CartContext = React.createContext({
  videoList: [],
  addVideo: () => {},
})

export default CartContext
