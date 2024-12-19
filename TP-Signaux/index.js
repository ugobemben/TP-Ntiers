// Variable pour suivre l'état d'arrêt possible
let canBeStopped = true;

// Fonction générique pour gérer les signaux
async function handleSignal(signal) {
    if (!canBeStopped) {
        console.log("Impossible d'arrêter le processus pour le moment.");
        return;
    }

    console.log(`Signal ${signal} reçu.`);
    console.log("Nettoyage en cours...");
    
    setTimeout(() => {
        console.log("Arrêt du processus.");
        process.exit(0);
    }, 5000);
}
  
  // Ecoute du signal SIGINT.
  process.on("SIGINT", () => handleSignal("SIGINT"));
  
  // Ajout de l'écoute du signal SIGTERM
  process.on("SIGTERM", () => handleSignal("SIGTERM"));
  
  // Simulation d'une application qui reste active
  console.log("Application en cours d'exécution.");
  console.log(
    "Appuyez sur CTRL+C pour envoyer un signal."
  );
  
  // Alterne l'état d'arrêt toutes les 5 secondes
  setInterval(() => {
    canBeStopped = !canBeStopped;
    console.log(`Le processus est ${canBeStopped ? 'arrêtable' : 'non arrêtable'} maintenant...`);
  }, 5000);
  