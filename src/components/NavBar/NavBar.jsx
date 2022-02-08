import './NavBar.css';
import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';

function NavBar({ user, setUser }) {
  function handlelogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <nav className='navBackground'>
      <span>Welcome, {user.name}</span>&nbsp;
      <Link className='navButton' to='/orders/new'>
        Translate
      </Link>
      &nbsp;
      <Link className='navButton' to='/orders'>
        Favourites
      </Link>
      &nbsp;
      <Link className='navButton' onClick={handlelogOut} to=''>
        Log Out
      </Link>
    </nav>
  );
}

export default NavBar;
