import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {userIdInput: '', pinInput: ''}

  onUserIdChange = event => {
    this.setState({userIdInput: event.target.value})
  }

  onPinChange = event => {
    this.setState({pinInput: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userIdInput, pinInput} = this.state
    const userDetails = {user_id: userIdInput, pin: pinInput}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jwtToken = data.jwt_token
      this.onSubmitSuccess(jwtToken)
    } else {
      const data = await response.json()
      const errorMsg = data.error_msg
      this.onSubmitFailure(errorMsg)
    }
  }

  render() {
    const {userIdInput, pinInput, errorMsg} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <div className="login-card">
          <div className="login-img-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-img"
            />
          </div>
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <h1 className="form-heading">Welcome Back!</h1>
            <label htmlFor="userId" className="label-styles">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userIdInput}
              placeholder="Enter User ID"
              className="input-styles"
              onChange={this.onUserIdChange}
            />
            <label htmlFor="pin" className="label-styles">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pinInput}
              placeholder="Enter PIN"
              className="input-styles"
              onChange={this.onPinChange}
            />
            <button type="submit" className="login-btn">
              Login
            </button>
            <p className="error-msg">{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
