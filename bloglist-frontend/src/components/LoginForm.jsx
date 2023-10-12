import { useState } from 'react'

const LoginForm = ({
  login,
  // newUsername, handleUsernameChange,
  // newPassword, handlePasswordChange
}) => {

  // use states
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // event handlers
  const handleUsernameChange = (event) => setNewUsername(event.target.value)
  const handlePasswordChange = (event) => setNewPassword(event.target.value)


  // method functions
  const handleLogin = async (event) => {
    event.preventDefault()
    login(newUsername, newPassword)
    setNewUsername('')
    setNewPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor='username'>Username: </label>
        <input id='username' type='text' value={newUsername} onChange={handleUsernameChange}/>
      </div>
      <div>
        <label htmlFor='password'>Password: </label>
        <input id='password' type='password' value={newPassword} onChange={handlePasswordChange}/>
      </div>
      <input id='submitLogin' type='submit' value='Login'/>
    </form>
  )
}

export default LoginForm