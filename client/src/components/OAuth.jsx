 import {GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth";
import {app} from "../firebase";
import {useDispatch} from "react-redux";
import {signInSuccess} from "../redux/user/userSlice.js";
 import {useNavigate} from "react-router-dom";

const OAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handelGoogleClick = async () => {

        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const response = await fetch("http://localhost:8000/api/auth/google", {
                method: "POST",
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),

                headers:{
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log(data);
            dispatch(signInSuccess(data));
            navigate('/');

        } catch (err){
            console.log("could not login with google",err);
        }
    }

    return (
        <button type={'button'} onClick={handelGoogleClick}  className={'bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85 active:opacity-100 cursor-pointer'}>Continue with google</button>
    );
}

export default OAuth;