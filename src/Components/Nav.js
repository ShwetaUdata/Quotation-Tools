"use client"

import { useState, useEffect } from "react"

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken")
      const idToken = localStorage.getItem("idToken")
      setIsAuthenticated(!!(accessToken && idToken))
    }

    // Check initial auth status
    checkAuth()

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    // Listen for URL changes
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener("popstate", handleLocationChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("popstate", handleLocationChange)
    }
  }, [])

  if (!isAuthenticated || currentPath === "/") {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("idToken")
    localStorage.removeItem("refreshToken")
    window.location.href = "/"
  }

  return (
    <nav
      style={{
        backgroundColor: "#1f2937",
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "white",
          }}
        >
          Project App
        </div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a
            href="/Home"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#374151")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Home
          </a>

          <a
            href="/Generated"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#374151")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Generated Quotes
          </a>

          <a
            href="/Quotation"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#374151")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Quotation Tools
          </a>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
