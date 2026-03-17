import ClearFilterButton from "@/Components/ClearFiltersButton";
import FilterToggle from "@/Components/FilterToggle";
import SearchInput from "@/Components/SearchInput";
import StatusSwitchCell from "@/Components/StatusSwitchCell";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DEPARTMENT_OPTIONS, HEAD_STATUS_OPTIONS } from "@/constants";
import { router } from "@inertiajs/react";
import { SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

const HeadList = ({ dept_heads, queryParams: rawParams }) => {
    const queryParams = rawParams || {};
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(dept_heads.length / ITEMS_PER_PAGE);
    const paginatedEmployees = dept_heads.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );
    const [heads, setHeads] = useState(dept_heads);

    const handleStatusUpdated = (id, status) => {
        setHeads((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status } : item)),
        );
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-3 gap-6">
                <h2 className="text-lg font-bold flex-shrink-0">
                    Department Head List
                </h2>

                <div className="flex items-center gap-2">
                    <FilterToggle
                        queryParams={queryParams}
                        visibleFilters={["status", "department"]}
                        url={"departmenthead.index"}
                    />

                    <SearchInput
                        url={"departmenthead.index"}
                        queryParams={queryParams}
                        label={"Search Department Head"}
                    />

                    <ClearFilterButton routeName={"departmenthead.index"} />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-blue-900 hover:bg-blue-800">
                        <TableHead className="text-center text-white">
                            Id
                        </TableHead>
                        <TableHead className="text-center text-white">
                            Employee Name
                        </TableHead>
                        <TableHead className="text-center text-white">
                            Position
                        </TableHead>
                        <TableHead className="text-center text-white">
                            Department
                        </TableHead>
                        <TableHead className="text-center text-white">
                            Work Type
                        </TableHead>
                        <TableHead className="text-center text-white">
                            Head Status
                        </TableHead>
                        <TableHead className="text-center text-white">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedEmployees.map((emp) => (
                        <TableRow key={emp.id} className="hover:bg-gray-100">
                            <TableCell className="text-center">
                                {emp.head.id}
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center items-center gap-2">
                                    {emp.head.full_name}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {emp.head.position}
                            </TableCell>
                            <TableCell className="text-center">
                                {DEPARTMENT_OPTIONS[emp.department]}
                            </TableCell>
                            <TableCell className="text-center">
                                {emp.head.work_type || "-"}
                            </TableCell>
                            <TableCell className="text-center">
                                <StatusSwitchCell
                                    emp={emp}
                                    onStatusUpdated={handleStatusUpdated}
                                />
                            </TableCell>
                            <TableCell className="flex justify-center gap-2">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="rounded-full text-black hover:bg-red-400 hover:text-white"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="my-2 justify-end">
                    <PaginationPrevious
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    />
                    <PaginationContent>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={currentPage === i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                    <PaginationNext
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    />
                </Pagination>
            )}
        </div>
    );
};

export default HeadList;
