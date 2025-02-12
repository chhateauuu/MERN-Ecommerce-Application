import { useContext, useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from './Store'
import { useGetCategoriesQuery } from './hooks/productHooks'
import LoadingBox from './components/LoadingBox'
import MessageBox from './components/MessageBox'
import { getError } from './utils'
import { ApiError } from './types/ApiError'
import SearchBox from './components/SearchBox'
import './styles/custom.css' // Import the new styles

function App() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store)

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signoutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
  const { data: categories, isLoading, error } = useGetCategoriesQuery()

  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
      <Navbar expand="lg" className="modern-nav">
  <Container>
    <div className="d-flex justify-content-between align-items-center w-100">
      <LinkContainer to="/">
        <Navbar.Brand>
          <span className="brand-text">Aarya's Shop</span>
        </Navbar.Brand>
      </LinkContainer>

      <SearchBox />

      <Nav className="align-items-center">
        <Link
          to="#"
          className="nav-link theme-toggle"
          onClick={switchModeHandler}
        >
          <i className={mode === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
        </Link>

        {userInfo ? (
          <NavDropdown
            title={
              <span className="user-greeting">
                Hello, {userInfo.name.split(' ')[0]}
              </span>
            }
            id="basic-nav-dropdown"
            className="custom-dropdown"
          >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link to="/signin" className="nav-link sign-in-link">
                    <span className="user-greeting">Hello, Sign In</span>
                  </Link>
                )}

                <Link to="/cart" className="nav-link position-relative">
                  <div className="cart-icon-container">
                    <i className="fas fa-shopping-cart"></i>
                    {cart.cartItems.length > 0 && (
                      <span className="cart-badge">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </span>
                    )}
                  </div>
                </Link>
              </Nav>
            </div>
          </Container>
        </Navbar>

        <nav className="sub-header">
          <Container>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-light"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                className="categories-btn"
              >
                <i className="fas fa-bars"></i> Categories
              </Button>
              
              <Nav className="ms-3">
                {['New Arrivals', 'Best Sellers', 'Deals'].map((x) => (
                  <Link
                    key={x}
                    className="nav-link text-white"
                    to={`/search?tag=${x}`}
                  >
                    {x}
                  </Link>
                ))}
              </Nav>
            </div>
          </Container>
        </nav>
      </header>

      {sidebarIsOpen && (
        <div
          onClick={() => setSidebarIsOpen(false)}
          className="sidebar-backdrop"
        ></div>
      )}

      <div
        className={`sidebar ${sidebarIsOpen ? 'active' : ''}`}
      >
        <div className="sidebar-header">
          <h5>Categories</h5>
          <Button 
            variant="link" 
            onClick={() => setSidebarIsOpen(false)}
            className="close-btn"
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>

        <div className="sidebar-content">
          {isLoading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">
              {getError(error as ApiError)}
            </MessageBox>
          ) : (
            <Nav className="flex-column">
              {categories!.map((category) => (
                <Nav.Item key={category}>
                  <LinkContainer
                    to={{ pathname: '/search', search: `category=${category}` }}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
            </Nav>
          )}
        </div>
      </div>

      <main className="flex-grow-1">
        <Container className="mt-4">
          <Outlet />
        </Container>
      </main>

      <footer className="footer mt-auto">
        <Container>
          <div className="py-3 text-center">
            <p className="mb-0">© 2025 Aarya's Shop. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

export default App