import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';
import FirebaseConfig from '../firebaseConfig';
import Card from './Card';
import dataSearch from '../data/dataSearch.json';
import SearchBox from './SearchBox';
import GoogleServices from '../googleConfig';
import HomeHero from '../assets/images/filipp-romanovskij.jpg';
import FacebookLogo from '../assets/images/FacebookLogo.png';
import FacebookLogined from '../assets/images/FacebookLogined.png';

const styles = {
  stylesBtnFB: {
    position: 'absolute', right: 20, top: 15, width: 21, cursor: 'pointer'
  },
  LoginLable: {
    position: 'absolute', top: 35, right: 11, fontSize: 12, fontWeight: 'bold'
  }
}

class Home extends Component {

  constructor() {
    super();
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const firebaseObj = new FirebaseConfig();
    const currentUser = firebaseObj.GetCurrentUser();
    currentUser.then((user) => {
      this.setState({email: user.email})
    })
  }

  getValue(v) {
    const services = new GoogleServices().service;
    const googlestatus = new GoogleServices().status;

    services.textSearch({
      query: v
    }, (places, status) => {
      console.log(places);
      (status !== googlestatus.OK) || this.setState({ data: places })
    })
  }

  handleSignOut() {
    this.setState({email: ''}, () => {
      new FirebaseConfig().SignOut()
    })
  }
  handleSignIn() {
     new FirebaseConfig().FacebookAuth();
  }
  LoginWithFB() {
    if (!this.state.email) {
      return (
        <div>
          <img src={FacebookLogo} style={styles.stylesBtnFB} onClick={() => this.handleSignIn()} />
          <div style={styles.LoginLable}>LOGIN</div>
        </div>
      );
    } else {
      return (
        <div>
          <img src={FacebookLogined} style={styles.stylesBtnFB} onClick={() => {this.handleSignOut()}} />
          <div style={styles.LoginLable}>LOGOUT</div>
        </div>
      );
    }
  }

  generateCards(data) {
    if(data) {
      console.log(data);
      return (
        data.map((item) => {
          if(item.photos) {
            return (
              <Link to={`/detail/${item.place_id}`} key={item.place_id}>
                <Card
                  name={item.name}
                  photo={(item.photos[0].raw_reference) ? item.photos[0].raw_reference.fife_url : item.photos[0].getUrl({maxWidth: 640})}
                  address={item.formatted_address}
                />
              </Link>
            )
          }
        })
      )
    }
  }

  render() {
    return (
      <div>
        <div className="topbar">
          <SearchBox onInputChange={v => this.getValue(v)}/>
          {this.LoginWithFB()}
        </div>
        <div className="home-hero" style={{ height: window.innerHeight }}>
          <img src={HomeHero} />
          <div className="font-primary">UrView</div>
          <div className="font-secondary">REVIEW YOU EXPERIENCES OF INTERESTING PLACES.</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 60, justifyContent: 'center' }}>
          {this.generateCards(this.state.data || dataSearch.results)}
        </div>
      </div>
    )
  }
}

export default Home
