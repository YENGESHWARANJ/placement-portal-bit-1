import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Recruiter portal now unified into the main Google-only login page
// Just redirect to /login with recruiter role pre-selected
export default function RecruiterLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/login", { replace: true });
    }, []);
    return null;
}
