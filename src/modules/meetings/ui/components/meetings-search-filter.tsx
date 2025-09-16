import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { SearchIcon } from "lucide-react";

export const MeetingsSearchFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();
    return (
        <div className="relative">
            <Input 
            placeholder="Filter by name"
            className= "h-9 bg-white w-[200px] pl-7"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <SearchIcon className="absolute size-4 left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}