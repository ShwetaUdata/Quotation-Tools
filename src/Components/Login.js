"use client"

import { useState } from "react"
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js"
import userPool from "./UserPool"

const Login = () => {
  const [mode, setMode] = useState("login") // 'login', 'signup', 'confirm'
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken()
        const idToken = result.getIdToken().getJwtToken()

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("idToken", idToken)
        localStorage.setItem("userEmail", email)

        setMessage(`Login successful! Welcome, ${email}`)
        setLoading(false)

        window.location.href = "/Home"
      },
      onFailure: (err) => {
        setMessage("Login failed: " + err.message)
        setLoading(false)
      },
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (password !== confirmPassword) {
      setMessage("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const result = await new Promise((resolve, reject) => {
        userPool.signUp(email, password, [], null, (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        })
      })

      setMessage("Signup successful! Please check your email for confirmation code.")
      setMode("confirm")
    } catch (error) {
      setMessage("Signup failed: " + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    try {
      await new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        })
      })

      setMessage("Email confirmed successfully! You can now login.")
      setMode("login")
      setConfirmationCode("")
    } catch (error) {
      setMessage("Confirmation failed: " + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    maxWidth: "400px",
    margin: "200px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    fontFamily: "Arial, sans-serif",
  }

  const tabStyle = {
    display: "flex",
    marginBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  }

  const tabButtonStyle = (active) => ({
    flex: 1,
    padding: "10px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    borderBottom: active ? "2px solid #007bff" : "2px solid transparent",
    color: active ? "#007bff" : "#666",
    fontWeight: active ? "bold" : "normal",
  })

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    boxSizing: "border-box",
  }

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: loading ? "#ccc" : "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "10px",
  }

  const messageStyle = {
    padding: "10px",
    marginTop: "15px",
    borderRadius: "6px",
    backgroundColor: message.includes("successful") ? "#d4edda" : "#f8d7da",
    color: message.includes("successful") ? "#155724" : "#721c24",
    border: `1px solid ${message.includes("successful") ? "#c3e6cb" : "#f5c6cb"}`,
  }

  return (
    <div style={cardStyle}>
      <div style={tabStyle}>
        <button style={tabButtonStyle(mode === "login")} onClick={() => setMode("login")}>
          Login
        </button>
        <button style={tabButtonStyle(mode === "signup")} onClick={() => setMode("signup")}>
          Sign Up
        </button>
        <button style={tabButtonStyle(mode === "confirm")} onClick={() => setMode("confirm")}>
          Confirm
        </button>
      </div>

      {mode === "login" && (
        <form onSubmit={handleLogin}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={handleSignup}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      )}

      {mode === "confirm" && (
        <form onSubmit={handleConfirm}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Confirm Email</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Confirming..." : "Confirm Email"}
          </button>
        </form>
      )}

      {message && <div style={messageStyle}>{message}</div>}
    </div>
  )
}

export default Login
