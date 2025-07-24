const socket = io();
socket.emit('join-queue', 'Anonymous');

socket.on('ticket-assigned', ticket => {
    document.getElementById('ticketNumber').innerText = `#${ticket.number}`;
});

socket.on('queue-updated', ({ currentTicket }) => {
    document.getElementById('currentServing').innerText = `Now Serving: #${currentTicket}`;
});
