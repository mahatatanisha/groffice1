import React, { useState, useEffect } from 'react'
import {
    ref,
    uploadBytes,
    
} from "firebase/storage";
import { storage } from "./firebase";
import CloseIcon from '@mui/icons-material/Close';
import { useUserAuth } from "../context/UserAuthContext";
import '../cssfiles/uploadfile.css'

export const UploadFile = ({ showModals, setShowModals }) => {
    const [fileUpload, setFileUpload] = useState(null);
  const { user, userid } = useUserAuth();


    const uploadFile = () => {
       
        const metadata = {
            customMetadata: {
              name: user,  
              userId: userid,
              mode: "Private",
              
            },
          };
        if (fileUpload == null) return;
        const imageRef = ref(storage, `${userid}/${fileUpload.name}`);
        uploadBytes(imageRef, fileUpload, metadata).then(() => { 
            alert("Documented Added") ;   
        });
        
        
       
    };
   

    return (
        <>
            {showModals ? (
                <div className="Backgrounds">
                    <div className="ModalWrappers">
                        <div className="CloseModalButton">
                            <button onClick={() => setShowModals(prev => !prev)}><CloseIcon /></button>
                        </div>
                        <input type="file" onChange={(event) => {
                            setFileUpload(event.target.files[0]);
                        }}
                        />
                        <button type='button' className="btn btn-primary" onClick={uploadFile}> Upload Document</button>
                    </div>

                </div>
            ) : null}
        </>



    );

}