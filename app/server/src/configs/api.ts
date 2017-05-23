import * as express from 'express';
import * as passport from 'passport';

import user from '../api/user';
import auth from '../api/auth';

export default class ApiConfig {
  static modules: Array<any> = [
    user, auth
  ]
  static init( router: express.Router, modulesList?: Array<any> ) {
    this.modules.concat(modulesList || []);

    this.modules.forEach( module => {
      if( module.prototype['router']) {
         router.use('/api', module.prototype['router']);
      }
    });
    
    // router.post('/v1/auth', auth.create);
    // router.post('/v1/login', auth.login);
    // router.route('/v1/profile')
    //       .get(passport.authenticate('jwt', { session: false }), user.profile);
  }
}