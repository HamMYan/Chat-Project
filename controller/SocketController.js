    const { User, Message } = require('../model/model');

    class SocketController {
        constructor(server) {
            this.io = require('socket.io')(server);

            this.io.on('connection', (socket) => {
                console.log('------------------------------------------');
                console.log('| A user connected:', socket.id,'|');
                console.log('------------------------------------------');

                socket.on('newMess', async () => {
                    console.log('message');
                });
            });
        }

        async newMess(req, res, message,socket) {
            socket.emit('newMess');
            res.send('Hii');
        }
        
    }

    // res.redirect(`/user/chat/${req.params.id}`);
    module.exports = SocketController;
