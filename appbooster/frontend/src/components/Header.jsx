import React from 'react';
import {NavLink as Link} from 'react-router-dom';

function Header() {
  return (
    <header className='pt-3 pb-3'>
      <nav className='nav nav-pills justify-content-center'>
        <li className='nav-item'>
          <Link to={'/'} className='nav-link'
            activeClassName='active' exact={true}>Конвертер</Link>
        </li>
        <li className='nav-item'>
          <Link to={'/currencies'} className='nav-link'
            activeClassName='active' exact={true}>Курсы валют</Link>
        </li>
      </nav>
    </header>
  );
}

export default Header;
