import React from 'react';
import ReactSVG from 'react-svg'

function loadIcon(name, className, onClick) {
  const path =  require("./" + name +".svg");
  return (
    <div onClick={onClick}>
      <ReactSVG
        path={path}
        className={className}
     />
   </div>
  )
}

export default ({name, className, onClick}) => {
  return loadIcon(name, className, onClick);
}