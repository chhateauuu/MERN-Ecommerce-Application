import { useContext } from 'react'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Rating from '../components/Rating'
import { useGetProductDetailsBySlugQuery } from '../hooks/productHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { convertProductToCartItem, getError } from '../utils'

export default function ProductPage() {
  const params = useParams()
  const { slug } = params
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!)

  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const navigate = useNavigate()

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product!.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...convertProductToCartItem(product!), quantity },
    })
    toast.success('Product added to cart')
    navigate('/cart')
  }

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    <div className="product-details-page">
      <Row>
        <Col md={6} className="product-image-section">
          <div className="product-main-image">
            <img
              className="large"
              src={product.image}
              alt={product.name}
            />
          </div>
        </Col>

        <Col md={6} className="product-info-section">
          <div className="product-info-content">
            <Helmet>
              <title>{product.name}</title>
            </Helmet>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <Rating 
                rating={product.rating}
                numReviews={product.numReviews}
              />
              <span className="product-brand">
                Brand: {product.brand}
              </span>
            </div>

            <div className="product-description">
              <h2>About this item</h2>
              <p>{product.description}</p>
            </div>

            <div className="product-purchase-card">
              <div className="price-section">
                <span className="price-label">Price:</span>
                <span className="price-amount">${product.price}</span>
              </div>

              <div className="stock-section">
                <span className="stock-label">Status:</span>
                {product.countInStock > 0 ? (
                  <Badge bg="success" className="stock-badge">
                    In Stock
                  </Badge>
                ) : (
                  <Badge bg="danger" className="stock-badge">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {product.countInStock > 0 && (
                <div className="action-section">
                  <Button 
                    onClick={addToCartHandler}
                    className="add-to-cart-btn"
                  >
                    <i className="fas fa-cart-plus"></i>
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}