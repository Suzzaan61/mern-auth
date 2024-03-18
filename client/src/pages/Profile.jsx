import React from 'react';
import {useSelector} from "react-redux";

function Profile() {
    const {currentUser} = useSelector((state) => state.user);
    return (
        <div className={'p-3 max-w-lg mx-auto'}>
            <h1 className={'text-3xl font-semibold text-center my-7'}>Profile</h1>
            <form className={'flex flex-col gap-5'}>
                <img className={'h-24 w-24 self-center cursor-pointer rounded-full object-cover'} src={currentUser.rest.profilePicture} alt="Profile picture" />
                <input className={'bg-slate-200 p-3 rounded-lg'} type="text" id={'username'} placeholder={'username'}  value={currentUser.rest.username}/>
                <input className={'bg-slate-200 p-3 rounded-lg'} type="email" id={'email'} placeholder={'email'} value={currentUser.rest.email} />
                <input className={'bg-slate-200 p-3 rounded-lg'} type="password" id={'password'} placeholder={'password'} />
                <button className={'bg-slate-700 text-white p-3 rounded-lg uppercase w-full hover:opacity-95'}>Update</button>
            </form>
            <div className={'flex justify-between items-center mt-5'}>
                <span className={'text-red-700 cursor-pointer'}>Delete Account</span>
                <span className={'text-red-700 cursor-pointer'}>Sign Out</span>
            </div>
        </div>
    );
}

export default Profile;