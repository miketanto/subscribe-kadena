import express from 'express'
import passport from 'passport'

import { validate } from '../../middlewares'
import { tokenService } from '../../services'
import { catchAsync, pick } from '../../utils'
import { tokenValidation } from '../../validations'

const router = express.Router()

router.get(
  '/get',
  validate(tokenValidation.get),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id', 'token_id', 'owner', 'subscription_id','listed'])
    const data = await tokenService.get({ ...options })
    res.locals = { tokens: data }
    next()
  }),
)

router.post(
  '/create',
  validate(tokenValidation.create),
  catchAsync(async (req, res, next) => {
    const options = req.body
    const receipt = await tokenService.create(options)
    res.locals = { receipt }
    next()
  }),
)

router.post(
  '/update',
  validate(tokenValidation.update),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    const updateOptions = req.body
    res.locals = await tokenService.update(options, updateOptions)
    next()
  }),
)

router.post(
  '/list',
  validate(tokenValidation.list),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    const updateOptions = req.body
    res.locals = await tokenService.list(options, updateOptions)
    next()
  }),
)

router.post(
  '/buy',
  validate(tokenValidation.buy),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    res.locals = await tokenService.buy({ ...options, user: req.user })
    next()
  }),
)

router.delete(
  '/delete',
  validate(tokenValidation.delete),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    const deleted = await tokenService.deleter(options)
    res.locals = { deleted }
    next()
  }),
)

export default router
