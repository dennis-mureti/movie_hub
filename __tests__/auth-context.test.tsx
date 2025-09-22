"use client"

import type React from "react"

import { renderHook, act } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"

const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should start with no user", () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
  })

  it("should allow user signup", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const success = await result.current.signup("test@example.com", "password", "Test User")
      expect(success).toBe(true)
    })

    expect(result.current.user).toEqual({
      id: expect.any(String),
      email: "test@example.com",
      name: "Test User",
    })
  })

  it("should allow user login", async () => {
    // First signup a user
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signup("test@example.com", "password", "Test User")
      result.current.logout()
    })

    // Then login
    await act(async () => {
      const success = await result.current.login("test@example.com", "password")
      expect(success).toBe(true)
    })

    expect(result.current.user?.email).toBe("test@example.com")
  })
})
