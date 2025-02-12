import { useContext } from 'react'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  return (
    <div className="cart-page">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="cart-title">Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Your cart is empty. <Link to="/" className="return-link">Continue Shopping</Link>
            </MessageBox>
          ) : (
            <div className="cart-items">
              {cartItems.map((item: CartItem) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <Link to={`/product/${item.slug}`} className="item-name">
                      {item.name}
                    </Link>
                    
                    <div className="quantity-controls">
                      <Button
                        onClick={() => updateCartHandler(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        className="qty-btn"
                      >
                        <i className="fas fa-minus"></i>
                      </Button>
                      <span className="quantity">{item.quantity}</span>
                      <Button
                        onClick={() => updateCartHandler(item, item.quantity + 1)}
                        disabled={item.quantity === item.countInStock}
                        className="qty-btn"
                      >
                        <i className="fas fa-plus"></i>
                      </Button>
                    </div>
                  </div>

                  <div className="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button
                    onClick={() => removeItemHandler(item)}
                    className="remove-btn"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Col>
        <Col md={4}>
          <Card className="cart-summary">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
                  </h3>
                  <h3 className="subtotal">
                    ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      className="checkout-btn"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}