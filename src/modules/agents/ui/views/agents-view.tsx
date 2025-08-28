"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { DataPagination } from "../components/data-pagination";

export const AgentsView = () => {
    const [filters, setFilters] = useAgentsFilters();
    const trpc = useTRPC();
    const {data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        pagination: {
            search: filters.search || undefined,
            page: filters.page,
            pageSize: DEFAULT_PAGE_SIZE
        }
    }));

    return (
        <div className = "flex-1 flex flex-col gap-y-4 md:px-8 px-4 pb-4">
            <DataTable data={data.items} columns={columns} />
            <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({page})}
            />
            {data.items.length === 0 && 
            <EmptyState title="Create your first Agent" description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call" />}
        </div>
    )
}

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading agents..." description="Please wait while we load the agents" />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState title="Error loading agents..." description="Please try again later" />
    )
}