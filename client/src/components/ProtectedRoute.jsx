// use the use contect hook from the core api
import { useContext } from 'react'
// use the navigate object for redirecting unauthorized users
import { Navigate } from 'react-router-dom'
// use the auth context made in the AuthContext file
import { AuthContext } from '../contexts/AuthContext'

// this function is very important it will handle the authentication
// of a user as they navigate the pages, using the auth context

// first export the function taking in the deconstructed children object
// which is the jsx inside the <ProtectedRoute> tags (which is everything)
export default function ProtectedRoute({ children }) {
  // assign a destructered user object so that it is null if it is empty
  // assign if authenticated
  const { user } = useContext(AuthContext)
  // if user is existing then they are authenticated so display all the html
  // otherwise navigate the current user to the signin page
  return user ? children : <Navigate to="/signin" replace />
}