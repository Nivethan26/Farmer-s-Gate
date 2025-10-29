import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const RoleBasedDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "buyer":
      return <Navigate to="/buyer" replace />;
    case "seller":
      return <Navigate to="/seller" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    case "agent":
      return <Navigate to="/agent" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RoleBasedDashboard;
