const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const generateQRCode = require('../../utils/generateQR');



app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server);

let queue = [];
let currentTicket = 0;

io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('join-queue', (name) => {
        const ticket = {
            number: queue.length + 1,
            name,
            status: 'waiting',
            joinedAt: Date.now()
        };
        queue.push(ticket);
        socket.emit('ticket-assigned', ticket);
        io.emit('queue-updated', { queue, currentTicket });
    });

    socket.on('call-next', () => {
        currentTicket++;
        io.emit('queue-updated', { queue, currentTicket });
    });

    socket.on('mark-no-show', (ticketNo) => {
        const t = queue.find(q => q.number === ticketNo);
        if (t) t.status = 'no-show';
        io.emit('queue-updated', { queue, currentTicket });
    });

    socket.on('skip-ticket', () => {
        currentTicket++;
        io.emit('queue-updated', { queue, currentTicket });
    });
});

server.listen(3000, () => console.log('Server on port 3000'));

app.get('/qr/:businessId', async (req, res) => {
    const businessId = req.params.businessId;
    const url = `http://localhost:3000/index.html?business=${businessId}`;
    const qr = await generateQRCode(url);
    res.send(`<img src="${qr}" />`);
});


