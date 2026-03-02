"use client";

import { Button, useAuth } from "@payloadcms/ui";
import { useRouter } from "next/navigation";

const EvaluateStudentsButton = ({ rowData }: any) => {

    const { user } = useAuth();
    
    const router = useRouter();

    
    if (user?.role !== "hoc_vu") return null;

    return (
        <Button
            size="small"
            onClick={() => {
                router.push(`/admin/collections/feedback/create?class=${rowData.id}`);
            }}
        >
            Đánh giá
        </Button>
    );
};

export default EvaluateStudentsButton;
