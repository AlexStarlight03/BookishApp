"use client";
import CurrentReadsClient from "@/components/ui/CurrentReadsClient";

export default function CurrentReadsClientWrapper({ initialBookshelves, initialBooks, userId }: { initialBookshelves: any[]; initialBooks: any[]; userId: string; }) {
  return (
    <CurrentReadsClient
      initialBookshelves={initialBookshelves}
      initialBooks={initialBooks}
      userId={userId}
    />
  );
}
