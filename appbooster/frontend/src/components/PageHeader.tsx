import React from "react";

export interface PageHeaderProps {
  title: string;
}

export default function PageHeader(props: PageHeaderProps) {
  return (
    <div className="d-flex flex-row justify-content-center">
      <h2>{props.title}</h2>
    </div>
  );
}
