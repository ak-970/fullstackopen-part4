const LoginForm = ({
  handleLogin,
  newUsername, handleUsernameChange,
  newPassword, handlePasswordChange
}) =>
  <form onSubmit={handleLogin}>
    <div>
      <label htmlFor='username'>Username: </label>
      <input id='username' type='text' value={newUsername} onChange={handleUsernameChange}/>
    </div>
    <div>
      <label htmlFor='password'>Password: </label>
      <input id='password' type='password' value={newPassword} onChange={handlePasswordChange}/>
    </div>
    <input type='submit' value='Login'/>
  </form>

export default LoginForm