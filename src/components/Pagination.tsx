'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export default function Pagination({ currentPage, totalPages, hasMore }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`/?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: 'var(--input-border)',
          color: 'var(--text-secondary)',
          backgroundColor: currentPage === 1 ? 'transparent' : 'var(--button-bg)'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = 'var(--button-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = 'var(--button-bg)';
          }
        }}
      >
        Previous
      </button>

      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && navigateToPage(page)}
          disabled={page === '...'}
          className="px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: page === currentPage ? '#3b82f6' : page === '...' ? 'transparent' : 'var(--button-bg)',
            color: page === currentPage ? 'white' : page === '...' ? 'var(--text-muted)' : 'var(--text-secondary)',
            borderColor: page === currentPage ? '#3b82f6' : page === '...' ? 'transparent' : 'var(--input-border)',
            cursor: page === '...' ? 'default' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage && page !== '...') {
              e.currentTarget.style.backgroundColor = 'var(--button-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage && page !== '...') {
              e.currentTarget.style.backgroundColor = 'var(--button-bg)';
            }
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage === totalPages || !hasMore}
        className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: 'var(--input-border)',
          color: 'var(--text-secondary)',
          backgroundColor: (currentPage === totalPages || !hasMore) ? 'transparent' : 'var(--button-bg)'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages && hasMore) {
            e.currentTarget.style.backgroundColor = 'var(--button-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages && hasMore) {
            e.currentTarget.style.backgroundColor = 'var(--button-bg)';
          }
        }}
      >
        Next
      </button>
    </div>
  );
}