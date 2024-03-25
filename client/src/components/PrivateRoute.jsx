import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import Profile from "../pages/Profile.jsx";

const PrivateRoute = () => {
    const currentUser = useSelector(state => state.user);

    return currentUser?.currentUser?.user ? (<Outlet/>) : (<Navigate to={'/sign-in'}/>);
}   
export default PrivateRoute;