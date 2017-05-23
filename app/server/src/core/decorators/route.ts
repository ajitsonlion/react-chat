import * as express from "express";

export interface IRouteConfig {
  path?: string
  method?: string
  middelware?: express.RequestHandler
}

export const SetRoute = function ( config: IRouteConfig ) {
  return function (target: any, propertyKey: string, descriptor: any) {
        var router: express.Router = express.Router();
        var originalMethod = descriptor.value;

        if ( !target.prototype.hasOwnProperty('router') ) {
          target.prototype.router = router;
        }

        router = target.prototype.router;

        if (config.method && config.path) {
          switch(config.method.toLowerCase()){
            case 'get':
              if ( config.middelware ) {
                router.get(config.path, config.middelware, originalMethod);
              } else {
                router.get(config.path, originalMethod);
              }
              break;
            case 'post':
              if ( config.middelware ) {
                router.post(config.path, config.middelware, originalMethod);
              } else {
                router.post(config.path, originalMethod);
              }
              break;
            case 'put':
              if ( config.middelware ) {
                router.put(config.path, config.middelware, originalMethod);
              } else {
                router.put(config.path, originalMethod);
              }
              break;
            case 'delete':
              if ( config.middelware ) {
                router.delete(config.path, config.middelware, originalMethod);
              } else {
                router.delete(config.path, originalMethod);
              }
              break;
          }
        }
    }
}
