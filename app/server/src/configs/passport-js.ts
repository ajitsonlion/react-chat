import * as express from 'express';
import * as passport from 'passport';
import * as passportHttpBearer from 'passport-http-bearer';
import * as passportJWT from 'passport-jwt';
import * as mongoose from 'mongoose';

export default class PassportJSConfig {
  public static init( app: express.Application ) {
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use( new passportJWT.Strategy( {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeader(),
      secretOrKey: process.env.SIGNIN_SECRET
    }, function ( payload: any, next: any ) {
      const { User } = app.locals;
      User.find( payload.id, (err: any, user: any) => {
        if ( err ) {
          return next( err, null );
        }
        return next( null, user[0] );
      })
    }))
  }
}