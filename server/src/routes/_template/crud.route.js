import validate from '../../middlewares/validate'
import { pick, catchAsync } from '../../utils'

/**
 * CRUD Template
 * @param {ExpressRouter} router
 * @param {Validator} validator
 * @param {Service} service
 * @param {String} pk
 */

export function getterRoute(router, validator, service, pk) {
  return (
    router.get(
      '/get',
      validate(validator.get),
      catchAsync(async (req, res, next) => {
        const options = pick(req.query, [pk])
        const payload = await service.get({ ...options })
        res.locals = payload
        next()
      }),
    )
  )
}

export function creatorRoute(router, validator, service) {
  return (router.post(
    '/create',
    validate(validator.create),
    catchAsync(async (req, res, next) => {
      const options = req.body
      const receipt = await service.create(options)
      res.locals = req.body
      next()
    }),
  ))
}

export function updaterRoute(router, validator, service, pk) {
  return (router.post(
    '/update',
    validate(validator.update),
    catchAsync(async (req, res, next) => {
      const options = pick(req.query, [pk])
      const updateOptions = req.body
      res.locals = await service.update(options, updateOptions)
      next()
    }),
  ))
}

export function deleterRoute(router, validator, service, pk) {
  return (
    router.delete(
      '/delete',
      validate(validator.delete),
      catchAsync(async (req, res, next) => {
        const options = pick(req.query, [pk])
        res.locals = { deleted: await service.deleter(options) }
        next()
      }),
    )
  )
}

// router.post('/replenish', validate(addressValidation.needAddressPost), catchAsync(async (req, res, next) => {
//   const options = pick(req.body, ['address'])
//   const { balance, isReplenished } = await addressService.replenish(options)
//   res.locals = { balance, isReplenished }
//   next()
// }))
