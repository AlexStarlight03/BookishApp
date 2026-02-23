"use client";
import DashboardCurrentReadsClient from "@/components/ui/DashboardCurrentReadsClient";

export default function DashboardClientWrapper({ initialBookshelves, initialBooks, userId }: { initialBookshelves: any[]; initialBooks: any[]; userId: string; }) {
  return (
    <DashboardCurrentReadsClient
      initialBookshelves={initialBookshelves}
      initialBooks={initialBooks}
      userId={userId}
    />
  );
}
