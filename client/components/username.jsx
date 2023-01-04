import React from 'react';
import Redirect from './redirect';

export default class NewUserName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      userName: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
    this.handleSubmitUserName = this.handleSubmitUserName.bind(this);
  }

  handleClick() {
    this.setState({
      isClicked: !this.state.isClicked
    });
  }

  handleUserName(event) {
    this.setState({
      userName: event.target.value
    });
  }

  handleSubmitUserName(event) {
    if (this.state.userName.length < 7) {
      event.preventDefault();

      return false;
    } else {

      event.preventDefault();

      const reqObj = {};
      reqObj.userName = this.state.userName;

      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqObj)
      };

      fetch('/api/users', req)
        .then(res => res.json())
        .then(data => {
          // console.log('data from username: ', data);
          this.setState({
            userName: ''
          });
          window.location.hash = `choose-room?${this.state.userName}`;
        });

      // REDIRECT:
      if (this.state.userName.length >= 7) return <Redirect to="choose-room" />;
    }
    // console.log('window location: ', window.location);
  }

  render() {
    if ((this.state.userName.length < 7) && (this.state.userName.length >= 1)) {
      return (
        <>
          <div className='instruct wht-txt'>
            <p className='wrong'>Username is invalid, please try again!</p>
          </div>
          <form onSubmit={this.handleSubmitUserName}>
            <div className='mt-5'>
              <label htmlFor='username'>
                <input name='username' type='text' placeholder='Type a username here' className='user-input' value={this.state.userName} onChange={this.handleUserName} onClick={this.handleClick} />
              </label>
            </div>
            <div className='mt-5'>
              <button type='submit' className='next grn' href='#choose-room'>NEXT</button>
            </div>
          </form>
        </>
      );
    } else if (this.state.userName.length >= 7) {
      return (
        <>
          <div className='instruct wht-txt'>
            <p className='correct'>Success! Please click next.</p>
          </div>
          <form onSubmit={this.handleSubmitUserName}>
            <div className='mt-5'>
              <label htmlFor='username'>
                <input name='username' type='text' placeholder='Type a username here' className='user-input' value={this.state.userName} onChange={this.handleUserName} onClick={this.handleClick} />
              </label>
            </div>
            <div className='mt-5'>
              <button type='submit' className='next grn' href='#choose-room'>NEXT</button>
            </div>
          </form>
        </>
      );
    } else {
      return (
        <>
          <div className='instruct wht-txt'>
            <p>Please enter a username below</p>
          </div>
          <form onSubmit={this.handleSubmitUserName}>
            <div className='mt-5'>
              <label htmlFor='username'>
                <input name='username' type='text' placeholder='Type a username here' className='user-input' value={this.state.userName} onChange={this.handleUserName} onClick={this.handleClick} />
              </label>
            </div>
            <div className='mt-5'>
              <div className='mt-5'>
                <button type='submit' className='next grn' href='#choose-room'>NEXT</button>
              </div>
            </div>
          </form>
        </>
      );
    }
  }
}
