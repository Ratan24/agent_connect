import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary} from "react-error-boundary";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";
import { DEFAULT_PAGE_SIZE } from "@/constants";


interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({searchParams}: Props) => {
    const filters = await loadSearchParams(searchParams);
    const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        redirect("/sign-in");
      }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({pagination: {
        search: filters.search || undefined,
        page: filters.page,
        pageSize: DEFAULT_PAGE_SIZE
    }}));
    
    return (
        <>
        <AgentsListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewLoading/>}>
                <ErrorBoundary fallback={<AgentsViewError />}>  
                    <AgentsView />
                </ErrorBoundary>
            </Suspense>
                    
        </HydrationBoundary>
        </>
    )
}

export default Page; 