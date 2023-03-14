import React from 'react'
import loading from 'D:/ReactApp/groffice/src/loading.gif'
function Spinner() {
    return (
        <div className='container d-flex justify-content-center '>
            <img src={loading} alt="loading" className="center" width={'80px'} />
        </div>
    )
}

export default Spinner