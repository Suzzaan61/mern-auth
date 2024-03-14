import React from 'react';
import {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import OAuth from "../components/OAuth.jsx";

function SignUp() {
    const navigate = useNavigate();
    const[formData, setFormData] = useState({username:"",password:"",email:"",confirmPassword:""});
    const[error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const handelChange = (e)=>{
        setFormData({...formData, [e.target.id] : e.target.value });
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            setError(false);
            // Using fetch
            const res = await fetch('http://localhost:8000/api/auth/signup', {
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);

            // // Using axios
            // const baseURL = "/api/auth/signup";
            // const res = await axios.post(baseURL, formData);
            // console.log(res);


            setLoading(false);
            if (data.success === false){
                setError(true);
                return;
            }
            setError(false);
            navigate('/sign-in');
        } catch (err){
            setLoading(false);
            setError(true);
        }


    }

    return (
        <>
            <div className="mx-auto p-5 text-center max-w-3xl">
                <h1 className={'font-semibold text-3xl my-8'}>Sign Up</h1>
                <form onSubmit={handelSubmit}  className={'flex flex-col gap-6'}>
                    <input type="text" id={'username'} className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Username'} onChange={handelChange} value={formData.username} required />
                    <input type="email" id={'email'} className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Email'} onChange={handelChange} value={formData.email} required />
                    <input type="password" id={'password'} className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Password'} onChange={handelChange} value={formData.password} required />
                    <input type="password" id={'confirmPassword'} className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Confirm Password'} onChange={handelChange}  required/>
                    <button disabled={loading}
                            className={'bg-slate-700 text-white p-3 rounded-lg uppercase w-full hover:opacity-95 disabled:opacity-85'}>
                        {loading ? 'Loading...' : 'Sign up'}
                    </button>
                    <OAuth/>
                </form>

                <div className={'flex gap-2 mt-5'}>
                    <p>Have an Account?</p>
                    <Link to={'/sign-in'}><span className={'text-blue-700'}>Sign in</span></Link>
                </div>
                <p className={'text-red-500 text-left'}>{error && "something went wrong  "}</p>
            </div>
        </>
    );
}

export default SignUp;