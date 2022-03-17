import React from "react";

export interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer(props: PageContainerProps) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9">{props.children}</div>
    </div>
  );
}
