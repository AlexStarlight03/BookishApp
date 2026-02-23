"use client";

import { useState } from "react";
import CreateBookshelfForm from "./CreateBookshelfForm";

export default function CreateBookshelfModal({ userId }: { userId: string }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        className="book-button px-4 py-2 rounded-full bg-[var(--accent)] text-white font-semibold shadow hover:bg-[var(--accent-dark)] transition-all"
        onClick={() => setShow(true)}
      >
        + Nouvelle étagère
      </button>
      {show && (
        <CreateBookshelfForm userId={userId} onClose={() => setShow(false)} />
      )}
    </>
  );
}