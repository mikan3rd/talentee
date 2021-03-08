import React from "react";

import { AdminIndex } from "@/components/pages/AdminIndex";
import { AdminAuthWrapper } from "@/components/templates/AdminAuthWrapper";
import { Meta } from "@/components/templates/Meta";

const AdminTop = React.memo(() => {
  return (
    <>
      <Meta title="管理トップ" />

      <AdminAuthWrapper>
        <AdminIndex />
      </AdminAuthWrapper>
    </>
  );
});

export default AdminTop;
