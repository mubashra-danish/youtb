import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
// import './index.css'
import Cookies from 'js-cookie'

// Login component
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      showPassword: false,
      showSubmitError: false,
      errorMsg: '',
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  // Event handler for toggling password visibility
  togglePasswordVisibility = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  render() {
    const {showSubmitError, errorMsg, showPassword} = this.state // Destructure showPassword from state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="username-input-field"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
              id="password"
              className="password-input-field"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          {/* Checkbox for toggling password visibility */}
          <div className="input-container">
            <label className="show-password-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={this.togglePasswordVisibility}
              />
              Show Password
            </label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
