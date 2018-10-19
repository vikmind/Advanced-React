import Link from 'next/link';
import NavStyles from '../components/styles/NavStyles';

const Nav = () => (
  <NavStyles>
    <Link href="/items">
      <a>Items</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <Link href="/me">
      <a>Me</a>
    </Link>
  </NavStyles>
)

export default Nav;
