"use client";
import { useState } from "react";

export default function DashboardGoalClient({ objective, readCount }: { objective: number | null; readCount: number }) {
  const progress = objective && objective > 0 ? Math.min((readCount / objective) * 100, 100) : 0;
  const [showGoalModal, setShowGoalModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center text-center bg-card rounded-xl shadow-lg py-8 px-6">
      <span className="book-title mb-2">Objectif annuel</span>
      <button
        className="mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-all"
        onClick={() => setShowGoalModal(true)}
      >
        {objective ? "Modifier l'objectif" : "Définir un objectif"}
      </button>
      <div className="relative w-full max-w-md h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-4 mt-2">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white drop-shadow">
          {progress.toFixed(1)}%
        </span>
      </div>
      <div className="text-lg font-semibold mt-2 mb-1" style={{ color: 'var(--brown)' }}>
        {readCount} / {objective || 0} livres lus
      </div>
      <div className="text-sm mt-2" style={{ color: 'var(--brown)' }}>
        {progress >= 100
          ? "Bravo, objectif atteint ! 🎉"
          : `${readCount} livres lus cette année`}
      </div>
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowGoalModal(false)} type="button">X</button>
            <h2 className="text-2xl font-bold mb-4">{objective ? "Modifier l'objectif" : "Définir un objectif"}</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              const value = Number((e.currentTarget.elements.namedItem("goal") as HTMLInputElement).value);
              if (!value || value < 1) {
                alert("Veuillez entrer un nombre valide.");
                return;
              }
              try {
                const { updateYearlyGoal } = await import("@/app/actions/user");
                const result = await updateYearlyGoal({ yearlyGoal: value });
                if (result.success) {
                  alert("Objectif mis à jour !");
                  setShowGoalModal(false);
                  window.location.reload();
                } else {
                  alert(result.message || "Erreur lors de la mise à jour.");
                }
              } catch (err) {
                alert("Erreur serveur. Veuillez réessayer.");
              }
            }}>
              <label className="block mb-2 font-semibold">Objectif de livres à lire cette année:</label>
              <input
                type="number"
                name="goal"
                defaultValue={objective || ""}
                min={1}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                required
              />
              <button
                type="submit"
                className="bg-[var(--accent)] text-white px-4 py-2 rounded mt-4 font-semibold"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
