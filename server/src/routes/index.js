import express from 'express'

import tokenRoute from './marketplace/token.route'
import subscriptionRoute from './marketplace/subscription.route'
import finalResponder from '../middlewares/finalResponder'

const router = express.Router()

const defaultRoutes = [
  {
    path: '/token',
    route: tokenRoute,
  },
  {
    path: '/subscription',
    route: subscriptionRoute,
  }
]

defaultRoutes.forEach((route) => router.use(route.path, route.route))

// API route catch-all final responder
// Skips if invalid route
router.use(finalResponder)

export default router
