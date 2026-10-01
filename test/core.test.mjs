// Objectif : vérifier la normalisation, la règle déterministe et la décision sémantique.
import test from "node:test";
import assert from "node:assert/strict";
import { evaluationCase, assessEssmsEvidence } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const edge = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-16"
  },
  "publicationStatus": "not_published"
};
test("exige une source", () => assert.throws(() => evaluationCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => { const provider = createFakeProvider(() => { throw new Error("appel interdit"); }); assert.equal((await assessEssmsEvidence(edge, provider)).decision, "absent_evidence"); assert.equal(provider.calls, 0); });
test("classe un dossier sourcé", async () => { const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "incomplete_evidence", probabilities: {
  "sufficient_evidence": 0.05,
  "incomplete_evidence": 0.85,
  "conflicting_evidence": 0.05,
  "absent_evidence": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 10, output_tokens: 0 } })); const result = await assessEssmsEvidence({
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
}, provider); assert.equal(result.decision, "incomplete_evidence"); assert.equal(result.review, false); });

const dossierÀRevoir = {
  "id": "revue-1",
  "text": "La synthèse annonce une action terminée tandis qu’une pièce plus récente indique qu’elle reste en cours.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-20"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};

test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({
    model: "jev-1.13.0",
    answers: {
      decision: {
        type: "choice",
        choice: "conflicting_evidence",
        probabilities: {
          sufficient_evidence: 0.15,
          incomplete_evidence: 0.15,
          conflicting_evidence: 0.55,
          absent_evidence: 0.15,
        },
        confidence: 0.62,
      },
    },
    usage: { input_tokens: 10, output_tokens: 0 },
  }));
  const résultat = await assessEssmsEvidence(dossierÀRevoir, provider);
  assert.equal(résultat.decision, "conflicting_evidence");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
