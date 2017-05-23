import {Request, Response} from 'express';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { SetRoute, IRouteConfig } from '../../core/decorators/route';

export default class Auth {
  
  @SetRoute(<IRouteConfig>{
    method: 'POST',
    path: '/v1/auth'
  })
  static create(req: Request, res: Response) {
    const { User } = req.app.locals;
    User.create(req.body, (err: any, user: any)=> {
        if ( err ) {
          return res.json(400, err);
        }
        res.json({ data: user });
    });
  }
  
  @SetRoute(<IRouteConfig>{
    method: 'POST',
    path: '/v1/login'
  })
  static login(req: Request, res: Response) {
    const { User } = req.app.locals;
    User.findOne({ email: req.body.email }, (err: any, user: any) => {
        if ( err ) {
          return res.json(400, err);
        }
        const token = jwt.sign({ id: user.id || user._id }, process.env.SIGNIN_SECRET );
        res.json({ data: token });
    });
  }
}