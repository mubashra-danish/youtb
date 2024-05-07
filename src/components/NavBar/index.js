import React from 'react'
import PopupDesign from '../PopupDesign'
import './index.css'

const NavBar = () => (
  <div className="cont">
    <nav>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
        alt="Nxt Watch Logo"
        className="image"
      />
      <div>
        <button>night</button>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
          alt="Profile"
          className="img-logo"
        />
        <PopupDesign />
      </div>
    </nav>
  </div>
)

export default NavBar
