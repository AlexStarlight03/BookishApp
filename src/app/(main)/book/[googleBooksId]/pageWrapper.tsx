<ClientBookActions googleBooksId={googleBooksId} />
    "use client";
    import AddToBookshelfButton from "@/components/ui/AddToBookshelfButton";
    import AddReviewButton from "@/components/ui/AddReviewButton";

    function ClientBookActions({ googleBooksId }: { googleBooksId: string }) {
        return (
        <div className="flex gap-2 mt-4">
            <AddToBookshelfButton googleBooksId={googleBooksId} />
            <AddReviewButton googleBooksId={googleBooksId} />
        </div>
        );
        }