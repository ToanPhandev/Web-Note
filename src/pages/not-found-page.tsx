import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-medium">Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back</Link>
    </div>
  );
};
