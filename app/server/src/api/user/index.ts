import {Request, Response} from 'express';
import * as passport from 'passport';
import { SetRoute, IRouteConfig } from '../../core/decorators/route';

export default class User {
  
  @SetRoute(<IRouteConfig>{
    method: 'GET',
    path: '/v1/user',
    middelware: passport.authenticate('jwt', { session: false })
  })
  static profile( req: Request, res: Response ) {
    let { email, username, id} = req.user;
    res.json({ data: { email, username, id } });
  }
}