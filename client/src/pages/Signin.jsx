import React from 'react';
import {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

function SignIn() {
    const navigate = useNavigate();
    const[formData, setFormData] = useState({email:"",password:""});
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
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await res.json();


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
            navigate('/');

        } catch (err){
            setLoading(false);
            setError(true);
        }



    }

    return (
        <>
            <div className="mx-auto p-5 text-center max-w-3xl">
                <h1 className={'font-semibold text-3xl my-8'}>Sign In</h1>
                <form onSubmit={handelSubmit}  className={'flex flex-col gap-6'}>
                    <input type="email" id={'email'} className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Email'} onChange={handelChange} value={formData.email} required />
                    <input type="password" id={'password'} className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Password'} onChange={handelChange} value={formData.password} required />
                    <button disabled={loading}
                            className={'bg-slate-700 text-white p-3 rounded-lg uppercase w-full hover:opacity-95 disabled:opacity-85'}>
                        {loading ? 'Loading...' : 'Sign up'}
                    </button>

                </form>

                <div className={'flex gap-2 mt-5'}>
                    <p>Don't Have an Account?</p>
                    <Link to={'/sign-up'}><span className={'text-blue-700'}>Sign up</span></Link>
                </div>
                <p className={'text-red-500 text-left'}>{error && "something went wrong  "}</p>
            </div>
        </>
    );
}

export default SignIn;