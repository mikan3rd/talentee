import React from "react";

import { AdminIndex } from "@/components/pages/AdminIndex";
import { AuthWrapper } from "@/components/templates/AuthWrapper";
import { Meta } from "@/components/templates/Meta";
import { UserRole } from "@/graphql/generated";

const AdminTop = React.memo(() => {
  return (
    <>
      <Meta title="管理トップ" />

      <AuthWrapper roles={[UserRole.Admin]}>
        <AdminIndex />
      </AuthWrapper>
    </>
  );
});

export default AdminTop;
