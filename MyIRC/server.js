const net = require('net');

class IRCServer {
    constructor(port = 6667) {
        this.port = port;
        this.clients = new Map();
    }

    start() {
        const server = net.createServer((socket) => {
            socket.write('Entrez votre Nom : ');
            
            socket.pseudoSet = false;
            socket.buffer = '';

            socket.on('data', (data) => {
                socket.buffer += data.toString();
                let lines = socket.buffer.split(/\r?\n/);
                
                if (lines.length === 1) return;

                socket.buffer = lines.pop();
                
                lines.forEach(line => {
                    if (line.trim() === '') return;

                    if (!socket.pseudoSet) {
                        let pseudo = line.trim();
                        if (pseudo) {
                            this.clients.set(socket, pseudo);
                            socket.pseudoSet = true;
                            socket.write(`Salut ${pseudo} bienvenue dans le chat de EPSI\n`);
                            this.broadcast(`${pseudo} a rejoint le chat de EPSI\n`, socket);
                        }
                    } else {
                        if (line.trim() === '/list') {
                            let users = Array.from(this.clients.values()).join(', ');
                            socket.write(`Eleves connectes: ${users}\n`);
                        } else if (line.trim().startsWith('/whisper ')) {
                            let parts = line.trim().split(' ');
                            let targetPseudo = parts[1];
                            let message = parts.slice(2).join(' ');
                            let senderPseudo = this.clients.get(socket);
                            
                            let targetSocket = null;
                            for (let [s, p] of this.clients.entries()) {
                                if (p === targetPseudo) {
                                    targetSocket = s;
                                    break;
                                }
                            }

                            if (targetSocket) {
                                targetSocket.write(`[Whisper][${senderPseudo}] ${message}\n`);
                            } else {
                                socket.write(`Erreur: Utilisateur ${targetPseudo} non trouvé\n`);
                            }
                        } else {
                            let pseudo = this.clients.get(socket);
                            if (line.trim()) {
                                this.broadcast(`${pseudo}: ${line.trim()}\n`, socket);
                            }
                        }
                    }
                });
            });

            socket.on('end', () => {
                this.handleDisconnect(socket);
            });

            socket.on('error', () => {
                this.handleDisconnect(socket);
            });
        });

        server.listen(this.port, () => {
            console.log(`Serveur démarré sur le port ${this.port}\n`);
        });

        server.on('error', (err) => {
            console.log('Erreur serveur:', err);
        });
    }

    broadcast(message, senderSocket) {
        for (let [socket, _] of this.clients) {
            if (socket !== senderSocket) {
                try {
                    socket.write(message);
                } catch (err) {
                    console.log('Erreur d\'envoi:', err);
                    this.handleDisconnect(socket);
                }
            }
        }
    }

    handleDisconnect(socket) {
        let pseudo = this.clients.get(socket);
        if (pseudo) {
            this.broadcast(`${pseudo} a quitte le chat de EPSI\n`, socket);
            this.clients.delete(socket);
        }
        socket.destroy();
    }
}

const server = new IRCServer();
server.start();