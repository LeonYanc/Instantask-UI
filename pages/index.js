import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'


export default function IndexPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      })

      const userId = res.data.id

      // to/board?userId=xxx
      router.push(`/board?userId=${userId}`)
    } catch (err) {
      alert('Invalid email or password')
      console.error(err)
    }
  }

  return (
      <div className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
  )
}
