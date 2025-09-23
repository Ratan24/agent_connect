import Link from "next/link";

import {Button} from "@/components/ui/button";


export const CallEnded = () => {

    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className=" py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className= "flex flex-col text-center gap-y-2">
                        <h6 className="text-lg font-medium">Meeting Ended</h6>
                        <p className="text-sm"> The meeting has ended. Summary will appear in a few minutes.</p>
                    </div>
                    <Button asChild>
                        <Link href="/meetings">Back to Meetings</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

