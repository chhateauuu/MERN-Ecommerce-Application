import { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSignupMutation } from '../hooks/userHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function SignupPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  const { mutateAsync: signup, isLoading } = useSignupMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const data = await signup({
        name,
        email,
        password,
      })
      dispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate(redirect)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <Form onSubmit={submitHandler} className="auth-form">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </Form.Group>

            <div className="mb-3">
              <Button disabled={isLoading} type="submit" className="auth-button">
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to={`/signin?redirect=${redirect}`} className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  )
}