import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch(); // useDispatch must be called inside the component
  const navigate = useNavigate(); // useNavigate should also be inside the component
  const { user } = useSelector((state) => state.auth); // Get user state from Redux

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">
          <Link to="/" className="hover:underline">Resume Builder</Link> {/* Link to Home page */}
        </h1>
        <div>
          {user ? (
            <>
              <span className="text-white mr-4">Welcome, {user.email}</span>
              <button
                onClick={handleLogout} // Correctly call handleLogout here
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
