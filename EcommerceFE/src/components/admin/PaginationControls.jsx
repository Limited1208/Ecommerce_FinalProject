export default function PaginationControls({ page, limit, total, count = 0, hasMore, onPageChange }) {
    const totalPages = total != null ? Math.max(1, Math.ceil(total / limit)) : null;
    const computedHasMore = totalPages != null ? page < totalPages : hasMore != null ? hasMore : count === limit;
    const prevDisabled = page <= 1;
    const nextDisabled = !computedHasMore;

    const startIndex = count > 0 ? (page - 1) * limit + 1 : 0;
    const endIndex = (page - 1) * limit + count;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 border-t border-[#2a1500] text-[#aa8866] text-xs">
            <div>
                {totalPages != null ? (
                    <span>Showing {startIndex}-{endIndex} of {total} items</span>
                ) : (
                    <span>Showing {count} items on page {page}</span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={prevDisabled}
                    className={`px-3 py-2 rounded-lg text-[11px] font-semibold transition ${prevDisabled ? "bg-[#1a0a00] text-[#664433] cursor-not-allowed" : "bg-[#110700] text-white hover:bg-[#1e1000]"}`}
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={nextDisabled}
                    className={`px-3 py-2 rounded-lg text-[11px] font-semibold transition ${nextDisabled ? "bg-[#1a0a00] text-[#664433] cursor-not-allowed" : "bg-[#110700] text-white hover:bg-[#1e1000]"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
