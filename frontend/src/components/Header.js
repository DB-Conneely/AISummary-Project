//summary-project/frontend/src/components/header.js
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-md py-4">
      <div className="container mx-auto px-4 flex items-center">
        <Link to="/">
          <img src="/logo.svg" alt="IntuitiveAI Logo" className="h-10 hover:opacity-80 transition" />
        </Link>
      </div>
    </header>
  );
}

export default Header;