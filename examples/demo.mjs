// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { assessEssmsEvidence } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
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
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "incomplete_evidence", probabilities: {
  "sufficient_evidence": 0.05,
  "incomplete_evidence": 0.85,
  "conflicting_evidence": 0.05,
  "absent_evidence": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await assessEssmsEvidence(dossier, provider);
assert.equal(résultat.decision, "incomplete_evidence");
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
