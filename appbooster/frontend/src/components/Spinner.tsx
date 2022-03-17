import React from "react";

export default function Spinner() {
  return (
    <div className="row justify-content-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );
}
