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
import VisibilityIcon from '@mui/icons-material/Visibility';
import fileDownload from 'js-file-download'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {
    ref, listAll, getMetadata, getDownloadURL

} from "firebase/storage";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Spinner from './Spinner';


function Documents() {

    useEffect(() => {
        listAllDocuments();
    }, [fileNames]);

    const [showModals, setShowModals] = useState(false);
    const [fileNames, setFileNames] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, userid , setCallFrom, callFrom} = useUserAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const MyOptions = [
        "+ Create a Sub Group"
      ];
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    
        console.log("you clicked!")
      };
    
      const open = Boolean(anchorEl);
    
      const handleClose = () => {
        setShowModals(prev => !prev);
        setCallFrom("SubGroup");
        setAnchorEl(null);
      };

    const openModals = () => {
        setShowModals(prev => !prev);
    };

    const getDownload = (filename) => {
        setLoading(true);
        getDownloadURL(ref(storage, `${userid}/${filename}`))
            .then((url) => {
                // `url` is the download URL for 'images/stars.jpg'

                // This can be downloaded directly:
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                    fileDownload(blob, filename);
                    setLoading(false);
                };
                xhr.open('GET', url);
                xhr.send();

                // const img = document.getElementById('document');
                // img.setAttribute('src', url);
            })
    }

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

                    </ul>
                    <hr />
                </div>


                <table className='table-content'>
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Size</th>
                            <th scope="col">Type</th>
                            <th scope="col">Mode</th>
                            <th scope="col">Download</th>


                        </tr>
                    </thead>
                    <tbody>
                        {fileNames.map((file) => (

                            <tr key={file.Name}>
                                <th scope="row"> <DescriptionIcon /> {file.Name}</th>
                                <td>{file.size}</td>
                                <td>{file.type}</td>
                                <td onClick={handleClick}><VisibilityIcon /></td>
                                <Menu
                                    anchorEl={anchorEl}
                                    menuprops={{ keepMounted: false, disablePortal: true }}
                                    onClose={handleClose}
                                    open={open}>
                                    {MyOptions.map((option) => (
                                        <MenuItem
                                            key={option}
                                            onClick={handleClose}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Menu>
                                {loading ? <Spinner /> :
                                    <td onClick={() => {
                                        console.log("File Name: ", file.Name);
                                        setSelectedFile(file.Name);
                                        getDownload(file.Name);
                                    }}>
                                        <FileDownloadIcon />
                                    </td>}

                            </tr>
                        ))}


                    </tbody>


                </table>



            </div>

        </div>
    )
}

export default Documents