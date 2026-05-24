import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="text-center mt-20">
    <h1 className="text-6xl font-bold text-gray-300">404</h1>
    <p className="text-xl mt-4">Page not found</p>
    <Link to="/dashboard" className="text-blue-600 mt-4 inline-block">Go to Dashboard</Link>
  </div>
);

export default NotFound;