import React, { useState, useEffect } from 'react'
import {
    ref,
    uploadBytes,

} from "firebase/storage";
import { storage } from "./firebase";
import CloseIcon from '@mui/icons-material/Close';
import { useUserAuth } from "../context/UserAuthContext";
import '../cssfiles/imageupload.css'

export const ImageUpload = ({ showModals, setShowModals }) => {
    const [fileUpload, setFileUpload] = useState(null);
    const { user, userid } = useUserAuth();


    const uploadFile = () => {

        const metadata = {
            customMetadata: {
                name: user,
                userId: userid,

            },
        };
        if (fileUpload == null) return;
        const imageRef = ref(storage, `${userid}/${fileUpload.name}`);
        uploadBytes(imageRef, fileUpload, metadata).then(() => {
            alert("Documented Added");
        });



    };


    return (
        <>
            {showModals ? (
                <div className="Backgrounds imageupload">
                    <div className="ModalWrappers">
                        <div className="CloseModalButton">
                            <button onClick={() => setShowModals(prev => !prev)}><CloseIcon /></button>
                        </div>
                        <div className="row">
                            <div className="small-12 medium-2 large-2 columns">
                                <div className="circle">
                                    <img className="profile-pic" src="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" />

                                </div>
                                <div className="p-image">
                                    <i className="fa fa-camera upload-button"></i>
                                    <input className="file-upload" type="file" accept="image/*" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ) : null}
        </>



    );

}