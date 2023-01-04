import React from 'react';

export default class SelectRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonClicked: false,
      selectClicked: false,
      currentVal: null,
      userName: window.location.hash.slice(13)
    };
    this.selectClicked = this.selectClicked.bind(this);
    this.buttonClicked = this.buttonClicked.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  selectClicked(event) {
    this.setState({
      selectClicked: !this.state.selectClicked,
      currentVal: event.target.value,
      buttonClicked: false
    });
    // eslint-disable-next-line
    // console.log('clicked?: ', !this.state.isClicked);
    // eslint-disable-next-line
    // console.log(typeof event.target.value);
  }

  buttonClicked() {
    this.setState({
      buttonClicked: true
    });
    // eslint-disable-next-line
    // console.log('please select');
  }

  handleSubmit(event) {
    if (this.currentVal === null) {
      event.preventDefault();
      return false;
    } else {
      event.preventDefault();

      // this.setState({ userName: (this.state.currentHash).slice(13) });

      const reqObj = {};
      reqObj.chatRoomName = this.state.currentVal;
      reqObj.userName = this.state.userName;

      const req = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(reqObj)
      };

      // console.log('reqobj: ', reqObj);

      fetch('/api/usersInChat', req)
        .then(res => res.json())
        .then(data => {
          this.setState({
            currentVal: event.target.value
          });
          // INSERT HASH TO CHAT ROOM HERE:
          // ROOM HASH
        });
      // console.log('currentValue: ', this.state.currentVal);
      // console.log('username: ', this.state.userName);
    }
  }

  render() {

    // console.log('window location: ', (this.state.currentHash).slice(13));
    // console.log('window location: ', (window.location.hash).length);

    // eslint-disable-next-line
    // console.log('current value: ', this.state.currentVal);
    // eslint-disable-next-line
    // console.log('type: ', typeof this.state.currentVal);

    if (this.state.buttonClicked === true && this.state.currentVal === null) {
      return (
        <div className='pt-1'>
          <div className='select mt-5'>
            <form onSubmit={this.handleSubmit}>
              <div className='pt-4'>
                <label htmlFor='rooms' className='instruct pt-3 wrong'>Please select a chat room to join!</label>
              </div>
              <div className='pt-5'>
                <select required className='selection' name='rooms' onClick={this.selectClicked}>
                  <option value=''>Select a room here..</option>
                  <option value='rc1022' >rc1022</option>
                  <option value='lfz2022'>lfz2022</option>
                  <option value='zoomuni'>zoomuni</option>
                </select>
              </div>
              <div className='mt-5 pt-4'>
                <div className='mt-5'>
                  <button type='submit' className='next grn' onClick={this.buttonClicked}>NEXT</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    } else if (this.state.currentVal !== null && this.selectClicked) {
      return (
        <div className='pt-1'>
          <div className='select mt-5'>
            <form onSubmit={this.handleSubmit}>
              <div className='pt-4'>
                <label htmlFor='rooms' className='instruct pt-3 correct'>Please click next after selecting!</label>
              </div>
              <div className='pt-5'>
                <select required className='selection' name='rooms' onClick={this.selectClicked}>
                  <option value=''>Select a room here..</option>
                  <option value='rc1022' >rc1022</option>
                  <option value='lfz2022' >lfz2022</option>
                  <option value='zoomuni' >zoomuni</option>
                </select>
              </div>
              <div className='mt-5 pt-4'>
                <div className='mt-5'>
                  <button type='submit' className='next grn' onClick={this.buttonClicked}>NEXT</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className='pt-1'>
          <div className='select mt-5'>
            <form onSubmit={this.handleSubmit}>
              <div className='pt-4'>
                <label htmlFor='rooms' className='instruct pt-3 wht-txt'>Please select a chat room to join</label>
              </div>
              <div className='pt-5'>
                <select required className='selection' name='rooms' onClick={this.selectClicked}>
                  <option value=''>Select a room here..</option>
                  <option value='rc1022' >rc1022</option>
                  <option value='lfz2022' >lfz2022</option>
                  <option value='zoomuni' >zoomuni</option>
                </select>
              </div>
              <div className='mt-5 pt-4'>
                <div className='mt-5'>
                  <button type='submit' className='next grn' onClick={this.buttonClicked}>NEXT</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}
