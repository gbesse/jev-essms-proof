// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { assessEssmsEvidence } from "../src/index.mjs";
const client = createJevClient();
const résultat = await assessEssmsEvidence({
  "id": "exemple-1",
  "text": "Résultat d’évaluation publié avec synthèse et date, mais sans pièce permettant de relier deux actions correctives.",
  "source": {
    "url": "https://example.test/donnee-source",
    "date": "2026-09-15"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
