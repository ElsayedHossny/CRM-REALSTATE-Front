import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from './ui/pagination'

interface pagenationprops {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
}


export default function Pagenation({ currentPage, totalPages, onPageChange }: pagenationprops) {

    // if(totalPages <= 1 ) return null

    const getpage = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages]
        }
        if (currentPage >= totalPages - 3) {
            return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        }
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
    }
    return (
        <div>

            {totalPages > 1 && (
                <Pagination className='mt-3 mb-6'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-30"
                                        : "cursor-pointer"
                                }
                                onClick={() => {
                                    if (currentPage > 1) {
                                        onPageChange(currentPage - 1);
                                    }
                                }}
                            />
                        </PaginationItem>

                        {getpage().map((page, i) =>
                            page === "..." ? (
                                <PaginationItem key={`dots-${i}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={`${page}-${i}`}>
                                    <PaginationLink
                                        onClick={() => onPageChange(page as number)}
                                        isActive={currentPage === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}
                        <PaginationItem>
                            <PaginationNext onClick={() => onPageChange(currentPage + 1)}
                                className={currentPage === totalPages ? "pointer-events-none  opacity-30" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )
            }



        </div>
    )
}
