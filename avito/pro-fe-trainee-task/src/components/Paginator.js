import React from 'react';
import PropTypes from 'prop-types';

import './Paginator.css';

function Paginator({count, active, onPageClick}) {
  const range = new Array(Math.min(count, 10))
    .fill(1)
    .map((v, i) => i + v);

  const handlePageClick = (page) => {
    if (active !== page) {
      onPageClick(page);
    }
  };

  return (<nav className="paginator__wrapper">
    <ul className="paginator">{range.map(page =>
      <li className="paginator__item" key={page}>
        <a
          className="paginator__link"
          data-active={active === page}
          onClick={() => handlePageClick(page)}>{page}</a>
      </li>
    )}</ul>
  </nav>);
}

Paginator.propTypes = {
  count: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  onPageClick: PropTypes.func.isRequired
};

export default Paginator;
