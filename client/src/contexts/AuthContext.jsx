// import the context, state and effect
import { createContext, useState, useEffect } from 'react'
// get the fetchMe and signout functions from the api file 
import { fetchMe, signOut } from '../services/api'

// make a AuthContext object
export const AuthContext = createContext()

// make the AuthProvider function to be used as a tag
// taking in all the other jsx being rendered 
export default function AuthProvider({ children }) {
  // start a user and set user variable for the use state
  const [user, setUser] = useState(null)
  // set the loading and set loading as well from use state
  const [loading, setLoading] = useState(true)

  // call the use effect function
  useEffect(() => {
    // call the fetchMe function to get the current user
    fetchMe()
      // set the user on success
      .then(res => setUser(res.data.user))
      // otherwise there is not a valid session so leave the user null
      .catch(() => setUser(null))
      // set loading to false to signify the end of the lookup
      .finally(() => setLoading(false))
  }, [])

  // set the login variable
  const login = u => setUser(u)
  // set the logout variable
  const logout = () => signOut().then(() => setUser(null))

  // don't render the children until the user is identified
  if (loading) return null

  // otherwise return the jsx with the props to user, login, logout functions
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}