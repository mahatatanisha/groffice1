import React, { useState, useEffect, useRef } from 'react'
import '../cssfiles/notifications.css'
import ReactDOM from "react-dom";

function Notifications() {
    function useComponentVisible(initialIsVisible) {
        const [isComponentVisible, setIsComponentVisible] = useState(
          initialIsVisible
        );
        const ref = useRef(null);
      
        const handleHideDropdown = (event) => {
          if (event.key === "Escape") {
            setIsComponentVisible(false);
          }
        };
      
        const handleClickOutside = event => {
          if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
          }
        };
      
        useEffect(() => {
          document.addEventListener("keydown", handleHideDropdown, true);
          document.addEventListener("click", handleClickOutside, true);
          return () => {
            document.removeEventListener("keydown", handleHideDropdown, true);
            document.removeEventListener("click", handleClickOutside, true);
          };
        });
      
        return { ref, isComponentVisible, setIsComponentVisible };
      }

      const {
        ref,
        isComponentVisible,
        setIsComponentVisible
      } = useComponentVisible(true);

  return (
    
    <div className='notif'> 
        <div ref={ref}>
    {isComponentVisible && (
      <span style={{ border: "1px solid black" }}>Going into Hiding</span>
    )}
    {!isComponentVisible && (
        <p onClick={() => setIsComponentVisible(true)}>
          Component hidden: Click me show component again
        </p>
      )}
    </div>
    </div>
  )
}

export default Notifications