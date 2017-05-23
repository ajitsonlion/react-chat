import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';

export default class Bootstrap {
  static loadModels( app: express.Application, db: mongoose.Mongoose ) {
    
    fs.readdir( path.resolve(__dirname, '../models'), ( err, files: Array<string> ) => {
      files.forEach( file => {
        if ( file != '.' && file !== '..' ) {
          let newModel = require(path.resolve(__dirname, `../models/${file}`));
          if ( Object.keys(newModel).length > 0 ) {
            let modelName = Object.keys(newModel)[0];
            let model = db.model(modelName, newModel[modelName]);
            app.locals[modelName] = model;
          }
        }
      })
    })
  }
}