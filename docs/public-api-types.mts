// Objectif : vérifier que les types publics sont importables.
import { evaluationCase, assessEssmsEvidence } from "../src/index.mjs";
const dossier = evaluationCase({
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
});
void assessEssmsEvidence(dossier, { decide: async () => ({}) });
