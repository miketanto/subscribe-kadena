import express from 'express'
import passport from 'passport'

import { validate } from '../../middlewares'
import { subscriptionService } from '../../services'
import { catchAsync, pick } from '../../utils'
import { subscriptionValidation } from '../../validations'

const router = express.Router()

router.get(
  '/get',
  validate(subscriptionValidation.get),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['subscription_id', 'provider','name'])
    const items = await subscriptionService.get({ ...options })
    res.locals = { subscriptions: items }
    next()
  }),
)

router.post(
  '/create',
  validate(subscriptionValidation.create),
  catchAsync(async (req, res, next) => {
    const options = { ...req.body, user: req.user }
    const receipt = await subscriptionService.create(options)
    res.locals = { receipt }
    next()
  }),
)

router.post(
  '/update',
  validate(subscriptionValidation.update),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    const updateOptions = req.body
    res.locals = await subscriptionService.update(options, updateOptions)
    next()
  }),
)

router.post(
  '/list',
  validate(subscriptionValidation.list),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    const listOptions = req.body
    res.locals = await subscriptionService.list({ ...options, user: req.user }, listOptions)
    next()
  }),
)

router.post(
  '/buy',
  validate(subscriptionValidation.buy),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    res.locals = await subscriptionService.buy({ ...options, user: req.user })
    next()
  }),
)

router.delete(
  '/delete',
  validate(subscriptionValidation.delete),
  catchAsync(async (req, res, next) => {
    const options = pick(req.query, ['id'])
    const deleted = await subscriptionService.deleter(options)
    res.locals = { deleted }
    next()
  }),
)

export default router
