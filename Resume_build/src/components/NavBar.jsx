import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { useEffect } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log('aaaaaaa')
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    console.log("sending request to backend");
    const back_url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` + "/test";
    fetch(`${back_url}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("backend is active");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <nav className="bg-blue-600 p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">
          <Link to="/" className="hover:underline">Resume Builder</Link>
        </h1>
        <div>
          {user ? (
            <>
              {/* Use user.name or user.email based on what's available */}
              <Link
                to={`/${user.username || user.email}`} // Dynamic URL based on username or email
                className="text-white mr-4 hover:underline"
              >
                Welcome, {user.username || user.email} {/* Display user name or email */}
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
