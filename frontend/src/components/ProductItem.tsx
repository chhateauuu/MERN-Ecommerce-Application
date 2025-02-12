import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { Product } from '../types/Product'
import { convertProductToCartItem } from '../utils'
import Rating from '..//components/Rating'

function ProductItem({ product }: { product: Product }) {
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    
    if (product.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
    toast.success('Added to cart')
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
          />
          {product.countInStock <= 0 && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </Link>
      </div>
      
      <div className="product-info">
        <Link to={`/product/${product.slug}`} className="text-decoration-none">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="mb-2">
          <Rating 
            rating={product.rating} 
            numReviews={product.numReviews}
          />
        </div>
        
        <div className="product-price">
          ${product.price.toFixed(2)}
        </div>
        
        {product.countInStock > 0 ? (
          <button
            className="add-to-cart-btn"
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
          >
            <i className="fas fa-cart-plus me-2"></i>
            Add to Cart
          </button>
        ) : (
          <button className="add-to-cart-btn out-of-stock" disabled>
            <i className="fas fa-bell me-2"></i>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductItem