import * as express from 'express';
import * as path from 'path';
import * as socket from 'socket.io';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import *as fs from 'fs';
import * as mongoose from 'mongoose';
import Message from '../db/messageSchema';
import Room from '../db/roomSchema';
import * as serveStatic from 'serve-static';
import imageDecoder from './imageDecoder';

const port = 5000;
const app = express();
const server = http.createServer(app);
const io = socket(server);
const staticPath = path.join(__dirname, '..', '/public');

let room: any;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(serveStatic(staticPath));

app.get('/messages', (req: any, res: any) => {
    Message.find({room: room}, (err, docs) => {
        res.json(docs);
    });

});

app.get('/rooms', (req: any, res: any) => {
    console.log('in fetch rooms');
    Room.find({}, (err, docs) => {
        console.log('docs', docs);
        res.json(docs);
    });
});

app.post('/rooms', (req: any, res: any) => {
    let message = new Message({
        user: req.body.messages[0].user,
        content: req.body.messages[0].content,
        room: req.body.title
    });
    console.log('message', message);
    let room = new Room({title: req.body.title});

    message.save((err) => {
        if (err) return err;
    });

    room.save((err) => {
        if (err) return err;
    });

    res.json(message);
});

app.get('/', function (req: any, res: any) {
    console.log('get route caught this');
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

io.on('connection', function (socket: any) {
    console.log('a user connected');
    socket.on('subscribe', (data: any) => {
            room = data.room;
            socket.join(room);
            console.log('joined room', room);
        }
    );
    socket.on('unsubscribe', () => {
        socket.leave(room);
        console.log('leaving room', room);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('chat message', (msg: any) => {
        console.log('sending message to', msg.room);
        console.log('this message', msg);
        let message = new Message({user: msg.user, content: msg.message, room: msg.room});
        message.save((err) => {
            if (err) return err;
        });

        io.to(msg.room).emit('chat message', JSON.stringify(msg));
    });

    socket.on('new room', (roomData: any) => {
        let message = new Message({user: roomData.user, content: roomData.message, room: roomData.room});
        message.save((err) => {
            if (err) return err;
        });

    });

    socket.on('file_upload', (data: any, buffer: any) => {
        console.log(data);
        const user = data.user;
        const fileName = path.join(__dirname, '../public/images', data.file);
        const tmpFileName = path.join('/images', data.file);
        const imageBuffer = imageDecoder(buffer);

        fs.open(fileName, 'a+', (err, fd) => {
            if (err) throw err;

            fs.writeFile(fileName, imageBuffer.data, {encoding: 'base64'}, (err) => {
                fs.close(fd, () => {
                    let message = new Message({user: user, room: room, image: tmpFileName});

                    message.save((err) => {
                        if (err) return err;
                    });
                    console.log('file saved successfully!');
                });
            });
        });

        console.log('reached room, sending', fileName);
        io.to(room).emit('file_upload_success', {file: tmpFileName, user: user});
    });
});

mongoose.connect('mongodb://homelike:homelike@ds149711.mlab.com:49711/homelike');
mongoose.connection.once('open', () => {
    server.listen(port, (err: any) => {
        if (err) {
            console.log(err);
        } else {
            console.error(` Listening on http://localhost:${port}`);
        }
    });

});

