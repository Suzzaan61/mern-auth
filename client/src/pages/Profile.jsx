import React from 'react';
import {useSelector} from "react-redux";
import {useRef} from "react";
import {getStorage,ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {app} from "../firebase";


//Rules for firebase storage rules
// allow read;
// allow write : if
//     request.resource.size < 2 * 1024 * 1024 &&
//     request.resource.contentType.matches('image/.*');
function Profile() {
    const fileRef = useRef(null);
    const {currentUser} = useSelector((state) => state.user);
const [progress, setProgress] = React.useState(0);
const [imageError, setImageError] = React.useState(null);
    const [image, setImage] = React.useState(undefined);

    const [formData, setFormData] = React.useState({});
    console.log(formData);


    async function handelFileUpload(image) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is:" + progress+"% done");
                setProgress(Math.round(progress));
            },
        (error)=>{
            setImageError(true);
        },

        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setFormData({...formData, profilePicture: url})
            });
        }
        );
    }

    React.useEffect(()=>{
        if(image){
            handelFileUpload(image);
        }
    },[image])


    console.log(imageError);
    return (
        <div className={'p-3 max-w-lg mx-auto'}>
            <h1 className={'text-3xl font-semibold text-center my-7'}>Profile</h1>
            <form className={'flex flex-col gap-5'} >
                <input type="file"  ref={fileRef} hidden={true} accept="image/*" onChange={(e)=>setImage(e.target.files[0])} />
                <img onClick={()=> fileRef.current.click()} className={'h-24 w-24 self-center cursor-pointer rounded-full object-cover'} src={formData.profilePicture ||currentUser.rest.profilePicture} alt="Profile picture" />
                <p className={'self-center text-sm'}>{imageError === true?
                    (<span className={'text-red-500'}>Error uploading image(File size must me less than 2mb)</span>)
                    : progress > 0 && progress < 100 ?
                        (
                    <span>Uploading...{progress}%</span>
                ) :
                        progress === 100 ?
                            (<span className={'text-green-500'}>Uploaded successfully</span>)
                            : "" }</p>
                <input className={'bg-slate-200 p-3 rounded-lg'} type="text" id={'username'} placeholder={'username'}  value={ currentUser.rest.username}/>
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

export default Profile
