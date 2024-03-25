import React from 'react';
import { useSelector } from "react-redux";
import { useRef } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { userUpdateStart, updateSuccess, updateUserFail, deleteUserStart, deleteUserSuccess, deleteUserFail, signout } from "../redux/user/userSlice.js";


//Rules for firebase storage rules
// allow read;
// allow write : if
//     request.resource.size < 2 * 1024 * 1024 &&
//     request.resource.contentType.matches('image/.*');
function Profile() {
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [progress, setProgress] = React.useState(0);
    const [imageError, setImageError] = React.useState(null);
    const [image, setImage] = React.useState(undefined);
    const [updateDataSuccess, setUpdateDataSuccess] = React.useState(false);

    const [formData, setFormData] = React.useState({});

    const token = localStorage.getItem('token');

    async function handelFileUpload(image) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is:" + progress + "% done");
            setProgress(Math.round(progress));
        },
            (error) => {
                setImageError(true);
            },

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setFormData({ ...formData, profilePicture: url })
                });
            }
        );
    }

    const updateHandler = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    React.useEffect(() => {
        if (image) {
            handelFileUpload(image);
        }
    }, [image])


    const handelUpdateUser = async (e) => {

        e.preventDefault();
        try {
            setFormData({ ...formData, token: token });
            dispatch(userUpdateStart());
            const res = await fetch(`http://localhost:8000/api/user/update/${currentUser.user._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFail(data));
                return;
            }
            dispatch(updateSuccess(data));
            setUpdateDataSuccess(true);
        } catch (err) {
            dispatch(updateUserFail(err));
        }
    }

    const handelSignOut = async () => {
        try {
            localStorage.removeItem("token"); 
            dispatch(signout());

        } catch (err) {
            console.log(err);
        }
    }

    const deleteUserHandler = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`http://localhost:8000/api/user/delete/${currentUser.user._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token }),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFail(data));
                return;
            }
            dispatch(deleteUserSuccess());

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={'p-3 max-w-lg mx-auto'}>
            <h1 className={'text-3xl font-semibold text-center my-7'}>Profile</h1>
            <form className={'flex flex-col gap-5'} onSubmit={handelUpdateUser}>
                <input type="file" ref={fileRef} hidden={true} accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])} />
                <img onClick={() => fileRef.current.click()}
                    className={'h-24 w-24 self-center cursor-pointer rounded-full object-cover'}
                    src={formData.profilePicture || currentUser?.user.profilePicture} alt="Profile picture" />
                <p className={'self-center text-sm'}>{imageError === true ?
                    (<span className={'text-red-500'}>Error uploading image(File size must me less than 2mb)</span>)
                    : progress > 0 && progress < 100 ?
                        (
                            <span>Uploading...{progress}%</span>
                        ) :
                        progress === 100 ?
                            (<span className={'text-green-500'}>Uploaded successfully</span>)
                            : ""}</p>
                <input className={'bg-slate-200 p-3 rounded-lg'} onChange={updateHandler} type="text" id={'username'}
                    placeholder={'username'} defaultValue={currentUser?.user.username} />
                <input className={'bg-slate-200 p-3 rounded-lg'} onChange={updateHandler} type="email" id={'email'}
                    placeholder={'email'} defaultValue={currentUser?.user.email} />
                <input className={'bg-slate-200 p-3 rounded-lg'} onChange={updateHandler} type="password"
                    id={'password'} placeholder={'password'} />
                <button
                    className={'bg-slate-700 text-white p-3 rounded-lg uppercase w-full hover:opacity-95 disabled:opacity-85'}> {loading ? "Loading" : "Update"}</button>
            </form>
            <div className={'flex justify-between items-center mt-5'}>
                <span className={'text-red-700 cursor-pointer'} onClick={deleteUserHandler}>Delete Account</span>
                <span className={'text-red-700 cursor-pointer'} onClick={handelSignOut}>Sign Out</span>

            </div>
            <p className={'text-red-700 mt-5'}>{error && "Something went wrong"}</p>
            <p className={'text-green-700 mt-5'}>{updateDataSuccess && "User is updated successfully"}</p>
        </div>
    );
}

export default Profile
