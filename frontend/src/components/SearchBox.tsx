// SearchBox.tsx
import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    navigate(query ? `/search?query=${query}` : '/search')
  }
  return (
    <Form className="flex-grow-1 d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          placeholder="Search products..."
          aria-label="Search products"
          aria-describedby="button-search"
          onChange={(e) => setQuery(e.target.value)}
          className="modern-search"
        ></FormControl>
        <Button variant="outline-light" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  )
}