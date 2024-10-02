import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">
          <Link to="/" className="hover:underline">Resume Builder</Link>
        </h1>
        <div>
          {user ? (
            <>
              {/* Make username clickable, directing to `/username` */}
              <Link 
                to={`/${user}`} // Dynamic URL based on username
                className="text-white mr-4 hover:underline"
              >
                Welcome, {user}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
