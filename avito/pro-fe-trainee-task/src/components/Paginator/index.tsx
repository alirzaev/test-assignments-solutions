import React from "react";

import "./index.css";

interface PaginatorProps {
  count: number;
  active: number;
  onPageClick: (page: number) => void;
}

export default function Paginator(props: PaginatorProps) {
  const range = new Array(Math.min(props.count, 10))
    .fill(1)
    .map((v, i) => i + v);

  const handlePageClick = (page: number) => {
    if (props.active !== page) {
      props.onPageClick(page);
    }
  };

  return (
    <nav className="paginator__wrapper">
      <ul className="paginator">
        {range.map((page) => (
          <li className="paginator__item" key={page}>
            <span
              className="paginator__link"
              data-active={props.active === page}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
