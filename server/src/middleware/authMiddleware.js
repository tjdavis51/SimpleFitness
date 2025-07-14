// this function which be used the require the authorization of a user
export function requireAuth(req, res, next) {
  // check if the user is in the session
  // if so then move on
  if (req.session?.userId) return next()
  // otherwise send an error message as unauthoized
  res.status(401).json({ message: 'Unauthorized' })
}