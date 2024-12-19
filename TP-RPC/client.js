const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './todo.proto';

// Chargement du fichier proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

// Création du client
const client = new todoProto.TodoService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Fonction pour obtenir la météo
function getWeather() {
  client.getWeather({ city: 'Lille' }, (error, response) => {
    if (error) {
      console.error('Erreur:', error);
      return;
    }
    console.log('\n=== Météo à Lille ===');
    console.log(`Température: ${response.temperature}°C`);
    console.log(`Description: ${response.description}`);
    console.log(`Humidité: ${response.humidity}%`);
  });
}

// Exécution
getWeather();