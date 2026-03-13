'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { sessionManager as authStorage, type SessionUser as User } from '@/lib/core/session-manager'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshAuth: () => void
  clearError: () => void
  handleLoginFailure: (errorMessage: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = authStorage.getToken()
        const storedUser = authStorage.getUser()

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(storedUser)
          setError(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setError('Failed to initialize authentication')
        authStorage.clearSession()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (userData: User, userToken: string) => {
    console.log('AuthContext.login called:', {
      hasUser: !!userData,
      hasToken: !!userToken,
      userEmail: userData?.email,
      tokenLength: userToken?.length
    })
    
    try {
      // CRITICAL: Force clear all state before new login to prevent contamination
      console.log('Clearing all previous auth state...')
      authStorage.clearSession()
      setToken(null)
      setUser(null)
      setError(null)
      
      // Small delay to ensure cleanup completes
      setTimeout(() => {
        console.log('Previous state cleared, proceeding with login...')
      }, 10)
      
      // Store token first (most critical)
      console.log('Storing token...')
      // Store token and user together
      console.log('Storing token and user...')
      authStorage.createSession(userToken, userData)
      
      // Update React state
      console.log('Updating React state...')
      setToken(userToken)
      setUser(userData)
      setError(null)
      
      // Verify storage worked with multiple checks
      const immediateCheck = () => {
        const storedToken = authStorage.getToken()
        const storedUser = authStorage.getUser()
        const isAuth = authStorage.isAuthenticated()
        
        console.log('Login verification (immediate):', {
          storedToken: !!storedToken,
          storedUser: !!storedUser,
          isAuthenticated: isAuth,
          tokenMatches: storedToken === userToken,
          userMatches: storedUser?.email === userData?.email
        })
        
        if (!storedToken) {
          console.error('CRITICAL: Token not persisted immediately after storage!')
          throw new Error('Token storage failed - not persisted')
        }
      }
      
      immediateCheck()
      
      // Double-check after delay
      setTimeout(() => {
        const storedToken = authStorage.getToken()
        const storedUser = authStorage.getUser()
        const isAuth = authStorage.isAuthenticated()
        
        console.log('Login verification (delayed):', {
          storedToken: !!storedToken,
          storedUser: !!storedUser,
          isAuthenticated: isAuth,
          tokenMatches: storedToken === userToken,
          userMatches: storedUser?.email === userData?.email,
          allLocalStorageKeys: Object.keys(localStorage)
        })
        
        if (!storedToken && userToken) {
          console.error('CRITICAL: Token disappeared after successful storage!')
          // Attempt recovery
          try {
            console.log('Attempting token recovery...')
            authStorage.createSession(userToken, userData)
          } catch (recoveryError) {
            console.error('Token recovery failed:', recoveryError)
          }
        }
      }, 200)
      
      console.log('AuthContext.login completed successfully')
      
    } catch (error) {
      console.error('AuthContext.login failed:', error)
      
      // Force complete cleanup on failure
      try {
        authStorage.clearSession()
        setToken(null)
        setUser(null)
        setError('Failed to save login data')
      } catch (cleanupError) {
        console.error('Login cleanup failed:', cleanupError)
      }
      
      throw error
    }
  }

  const logout = () => {
    try {
      authStorage.clearSession()
      setToken(null)
      setUser(null)
      setError(null) // Clear errors on logout

      router.replace('/auth')
    } catch (error) {
      console.error('Error during logout:', error)
      setError('Logout failed')
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...userData }
        authStorage.createSession(token ?? '', updatedUser)
        setUser(updatedUser)
        setError(null)
      } catch (error) {
        console.error('Error updating user:', error)
        setError('Failed to update user data')
      }
    }
  }

  const refreshAuth = () => {
    try {
      const storedToken = authStorage.getToken()
      const storedUser = authStorage.getUser()

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
        setError(null)
      } else {
        setToken(null)
        setUser(null)
        setError(null)
      }
    } catch (error) {
      console.error('Error refreshing auth:', error)
      setError('Failed to refresh authentication')
    }
  }

  const clearError = () => {
    setError(null)
  }

  const handleLoginFailure = (errorMessage: string) => {
    console.log('Login failed, cleaning up state...')
    
    // Force clear everything on login failure to prevent contamination
    try {
      authStorage.clearSession()
      setToken(null)
      setUser(null)
      setError(errorMessage)
      setIsLoading(false)
      
      console.log('Login failure cleanup completed')
    } catch (error) {
      console.error('Failed to clean up after login failure:', error)
      setError('Authentication system error')
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    refreshAuth,
    clearError,
    handleLoginFailure
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protecting routes
export function withAuth<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options?: {
    redirectTo?: string
    requiredRole?: string
    loadingComponent?: React.ComponentType
  }
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter()
    const { isAuthenticated, isLoading, user } = useAuth()
    const { redirectTo = '/auth', requiredRole, loadingComponent: LoadingComponent } = options || {}

    useEffect(() => {
      if (isLoading) return

      if (!isAuthenticated) {
        router.replace(redirectTo)
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        router.replace('/')
      }
    }, [isLoading, isAuthenticated, user])

    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8726FF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
      return null
    }

    return <Component {...props} />
  }
}
