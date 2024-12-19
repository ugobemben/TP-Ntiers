const net = require("net");

const PORT = 5001;

// Connexion au serveur
const client = net.createConnection(PORT, "localhost", () => {
  console.log("--- Connecté au serveur.");

  // Création de l'objet de requête
  const request = {
    request: "echo",
    params: {
      text: "This is a test."
    }
  };

  // Envoi de la requête JSON au serveur
  client.write(JSON.stringify(request));
});

// Réception des réponses du serveur RPC
client.on("data", (data) => {
  const response = data.toString();

  console.log(response);
  client.end(); // Terminer la connexion après la réponse
});

client.on("end", () => {
  console.log("--- Déconnecté du serveur.");
});
