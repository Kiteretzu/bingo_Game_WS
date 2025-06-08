import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function TokenPage() {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("auth-token", token);

      navigate("/");
      window.location.reload(); // reloads the page at '/' so it refetches the data
    }
  }, []);
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {/* <span className='text-4xl font-bold'>Fuck YOU!!</span> */}
    </div>
  );
}

export default TokenPage;
