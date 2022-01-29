import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

function verifyToken (request: Request, response: Response, next: NextFunction) {
  const token: string = request.body.token
  || request.query.token
  || request.headers['authorization']

  if (!token) {
    return response.status(403).json({
      error: 'A token is required for authentication'
    })
  }

  const [bearer, jwtToken] = token.split(' ')

  try {
    const decodedToken = jwt.verify(jwtToken, process.env.TOKEN_KEY)
    request.signedCookies = decodedToken
  } catch (error) {
    return response.status(401).json({ error: 'Invalid token' })
  }

  return next()
}

export default verifyToken
