import React, { useState, useEffect } from 'react'
import '../cssfiles/document.css'
import Profile from './Profile'
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DescriptionIcon from '@mui/icons-material/Description';
import { UploadFile } from './UploadFile';
import { useUserAuth } from "../context/UserAuthContext";
import { storage } from "./firebase";
import {
    ref, listAll, getMetadata

} from "firebase/storage";



function Documents() {

    useEffect(() => {
        listAllDocuments();
    }, [fileNames]);

    const [showModals, setShowModals] = useState(false);
    const [fileNames, setFileNames] = useState([]);
    
    const { user, userid } = useUserAuth();

    const openModals = () => {
        setShowModals(prev => !prev);
    };

    const listRef = ref(storage, `${userid}/`);
    // Find all the prefixes and items.
    const listAllDocuments = () => {
        listAll(listRef)
            .then((res) => {

                res.items.forEach((itemRef) => {
                    console.log("items", itemRef.metadata);
                    getMetadata(ref(storage, `${userid}/${itemRef.name}`))
                        .then((metadatas) => {
                            setFileNames((oldArray) => [...oldArray, {
                                Name: itemRef.name,
                                size: metadatas.size,
                                type: metadatas.type,
                            }]);
                        })
                        .catch((error) => {
                            // Uh-oh, an error occurred!
                        });
                    
                });



            }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log("Uh-oh, an error occurred!");
            });
    }


    return (
        <div className='documents'>
            <Profile />
            <div className="upload-files">

                <div className="upload-buttons">
                    <h2>Upload Your Documents Here:</h2>

                    <ul>
                        <li><button><AddIcon /> New</button> </li>
                        <li><button onClick={openModals}> <ArrowUpwardIcon /> Upload</button> </li>
                        <UploadFile showModals={showModals} setShowModals={setShowModals} />
                        <li><button><ArrowDownwardIcon /> Download</button> </li>
                    </ul>
                    <hr />
                </div>


                <table>
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Size</th>
                            <th scope="col">Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        {fileNames.map((file) => (

                            <tr key={file.Name}>
                                <th scope="row"> <DescriptionIcon /> {file.Name}</th>
                                <td>{file.size}</td>
                                <td>{file.type}</td>
                            </tr>
                        ))}
                       

                    </tbody>


                </table>



            </div>

        </div>
    )
}

export default Documents