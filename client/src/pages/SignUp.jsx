import React from 'react';
import {Link} from "react-router-dom";

function SignUp() {
    return (
        <>
            <div className="mx-auto p-5 text-center max-w-3xl">
                <h1 className={'font-semibold text-3xl my-8'}>Sign Up</h1>
                <form className={'flex flex-col gap-6'}>
                    <input type="text" className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Username'}/>
                    <input type="email" className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Email'}/>
                    <input type="password" className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Password'}/>
                    <input type="password" className={'bg-slate-200 p-3 rounded-lg'} placeholder={'Confirm Password'}/>
                    <button
                        className={'bg-slate-700 text-white p-3 rounded-lg uppercase w-full hover:opacity-95 disabled:opacity-85'}>Sign
                        Up
                    </button>
                </form>

                <div className={'flex gap-2 mt-5'}>
                    <p>Have an Account?</p>
                    <Link to={'/sign-in'}><span className={'text-blue-700'}>Sign in</span></Link>
                </div>
            </div>
        </>
    );
}

export default SignUp;