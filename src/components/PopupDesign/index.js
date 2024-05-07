import React from 'react'
import Popup from 'reactjs-popup'
import {useHistory} from 'react-router-dom'
import './index.css'

const PopupDesign = () => {
  const history = useHistory()

  const handleConfirmLogout = () => {
    history.push('/login')
  }

  return (
    <Popup
      modal
      trigger={<button className="logout-button">Logout</button>}
      className="popup-content"
    >
      {close => (
        <div className="popup">
          <p>Are you sure you want to logout?</p>
          <div className="button-container">
            <button onClick={close}>Cancel</button>
            <button onClick={handleConfirmLogout}>Confirm</button>
          </div>
        </div>
      )}
    </Popup>
  )
}

export default PopupDesign
