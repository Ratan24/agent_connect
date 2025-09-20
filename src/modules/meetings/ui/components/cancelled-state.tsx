import { EmptyState } from "@/components/empty-state"



export const CancelledState = () => {
    return (
        <div className = " bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
            title="Meeting cancelled"
            description="The meeting was cancelled by the host."
            image="/cancelled.svg"
            />
            
        </div>
    )
}