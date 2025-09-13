import {JSX, useState} from "react";
import {Button} from "@/components/ui/button";
import {ResponsiveDialog} from "@/components/responsive-dialog";

export const useConfirm = (
    title: string,
    description: string,
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        });
    };

    // Renamed for clarity: this just closes the dialog UI
    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    // This handler now covers all "cancel" scenarios
    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () => (
        <ResponsiveDialog
            open={promise !== null}
            // Use handleCancel for any close action to resolve the promise
            onOpenChange={handleCancel}
            title={title}
            description={description}
        >
            <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                <Button variant="outline" onClick={handleCancel} className="w-full lg:w-auto">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} className="w-full lg:w-auto">
                    Confirm
                </Button>
            </div>
        </ResponsiveDialog>
    );

    return [ConfirmationDialog, confirm];
};