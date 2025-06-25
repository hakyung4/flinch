import React from "react";

export default function Pagination({ page, totalPages, onPageChange, loading }) {
  if (totalPages <= 1) return null;

  // Robust, non-buggy pagination blocks logic
  function getPages() {
    const pages = [];
    if (totalPages <= 7) {
      // Show all pages if count is low
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      // Show left-side ellipsis only if needed
      if (page > 4) {
        pages.push("...");
      }

      // Show up to 3 pages before and after current page, within bounds. Center the current page.
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Show right-side ellipsis only if needed
      if (page < totalPages - 3) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }
    return pages;
  }

  const pageBlocks = getPages();

  // Helper to conditionally set cursor style
  const getArrowCursor = (disabled) =>
    disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <nav className="flex justify-center items-center gap-1 mt-8 select-none">
      {/* First page arrow */}
      <button
        className={`px-2 py-1 rounded bg-orange-100 text-gray-700 hover:bg-orange-200 font-semibold disabled:opacity-50 ${getArrowCursor(page === 1 || loading)}`}
        onClick={() => !loading && onPageChange(1)}
        disabled={page === 1 || loading}
        aria-label="First page"
      >
        &laquo;
      </button>
      {/* Previous page arrow */}
      <button
        className={`px-2 py-1 rounded bg-orange-100 text-gray-700 hover:bg-orange-200 font-semibold disabled:opacity-50 ${getArrowCursor(page === 1 || loading)}`}
        onClick={() => !loading && onPageChange(page - 1)}
        disabled={page === 1 || loading}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>
      {/* Page number blocks with ellipsis */}
      {pageBlocks.map((p, idx) =>
        p === "..." ? (
          <span
            key={"ellipsis" + idx}
            className="px-3 py-1 rounded font-semibold transition bg-orange-50 text-orange-700"
            style={{
              minWidth: "2.25rem",
              textAlign: "center",
              display: "inline-block"
            }}
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            className={`px-3 py-1 rounded font-semibold transition ${
              page === p
                ? "bg-orange-300 text-white shadow"
                : "bg-orange-50 text-orange-700 hover:bg-orange-200 cursor-pointer"
            }`}
            onClick={() => !loading && onPageChange(p)}
            disabled={page === p || loading}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
      {/* Next page arrow */}
      <button
        className={`px-2 py-1 rounded bg-orange-100 text-gray-700 hover:bg-orange-200 font-semibold disabled:opacity-50 ${getArrowCursor(page === totalPages || loading)}`}
        onClick={() => !loading && onPageChange(page + 1)}
        disabled={page === totalPages || loading}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      {/* Last page arrow */}
      <button
        className={`px-2 py-1 rounded bg-orange-100 text-gray-700 hover:bg-orange-200 font-semibold disabled:opacity-50 ${getArrowCursor(page === totalPages || loading)}`}
        onClick={() => !loading && onPageChange(totalPages)}
        disabled={page === totalPages || loading}
        aria-label="Last page"
      >
        &raquo;
      </button>
    </nav>
  );
}