import httpStatus from 'http-status'
import passport from 'passport'

import { ApiError } from '../utils'

export async function aadAuth(req, res, next) {
  try {
    const authOptions = {
      response: res, // required
      failureRedirect: '/',
      session: true,
    }

    // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/maintenance/passport-azure-ad/lib/oidcstrategy.js#L546
    passport.authenticate('azuread-openidconnect', authOptions, () => {
      next()
    })(req, res, next)
  } catch (e) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e))
  }
}

export function regenerateSessionAfterAuthentication(req, res, next) {
  const passportInstance = req.session.passport
  return req.session.regenerate((err) => {
    if (err) throw err
    else {
      req.session.passport = passportInstance
      return req.session.save(next)
    }
  })
}
