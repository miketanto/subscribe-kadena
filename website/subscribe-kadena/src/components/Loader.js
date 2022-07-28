import React from 'react'
import {BallTriangle} from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";
import "./Loader.css"

function Loader({loading,showLoadingModal,loadingMessage,finishedMessage}) {
    const navigate = useNavigate()
  return (
    <div>
        <div className = "loadModal">
          <div className = "loadTitle">{loading?loadingMessage:finishedMessage}</div>
          <div className = "loadAnimation"> 
            {loading? <BallTriangle color="#511660" height={80} width={80}/> : <button className = "closeBtn"
            onClick = {()=>{
                showLoadingModal(false)
                navigate('/')
            }}
            >Exit</button>}
          </div>
        </div>
        <div className = "loadBackdrop"></div>
    </div>
  )
}

export default Loader