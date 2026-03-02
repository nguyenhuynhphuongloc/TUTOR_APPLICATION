import { Gutter } from "@payloadcms/ui";
import type { AdminViewServerProps } from "payload";
import React from "react";
import RolePermissionsClient from "./index.client";

export const RolePermissionsView: React.FC<AdminViewServerProps> = (
  ...props
) => {
  console.log({ props });
  const [data] = props;

  // Only allow admins to manage permissions
  if (data.user.role !== "admin") {
    return (
      <Gutter>
        <div className="py-10 text-center">
          <h2 className="text-xl font-bold text-destructive">
            Truy cập bị từ chối
          </h2>
          <p className="text-muted-foreground mt-2">
            Bạn không có quyền quản lý phân quyền.
          </p>
        </div>
      </Gutter>
    );
  }

  return (
    <Gutter>
      <div className="py-8">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Quản lý Phân Quyền
          </h1>
          <p className="text-secondary">
            Cấu hình quyền truy cập cho từng chức vụ đối với các danh mục dữ
            liệu.
          </p>
        </header>
        <RolePermissionsClient />
      </div>
    </Gutter>
  );
};

export default RolePermissionsView;
