/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FirebaseConfig from '../config/firebaseConfig';

class PlaceComments extends Component {

  state = {
    data: [],
    user: {},
    post: null,
  }

  componentDidMount() {
    const firebaseObj = new FirebaseConfig();
    this.place = firebaseObj.firebase.database().ref('/places/' + this.props.id);
    this.users = firebaseObj.firebase.database().ref('/users');

    const currentUser = firebaseObj.GetCurrentUser();
    currentUser.then((user) => {
      this.users.child(user.uid).once('value').then(user => {
        this.setState({
          user: user.val(),
        });
      });
    })
    this.getReviewSnapshot(this.place, this.users);
  }

  handleChange(e) {
    this.setState({ post: e.target.value });
  }

  getReviewSnapshot(place, users) {
    place.child('reviews').on('child_added', snapshot => {
      let review = snapshot.val();

      users.child(review.uid).once('value').then(user => {
        let data = {
          user: user.val(),
          comment: review.comment
        };
        this.setState({
          data: [data].concat(this.state.data)
        });
      });
    });
  }

  PostComment() {
    let comment = {
      comment: this.state.post,
      uid: this.state.user.uid,
    }
    this.place.child('reviews').push(comment).then(() => {
      this.setState({ post: '' });
    });
  }

  ClearComment() {
    this.setState({ post: '' });
  }

  generateComments(comments) {
    if(comments) {
      return (
        comments.map((comment, i) => (
          <div key={i} className={`${ i % 2 || 'odd' } layout-card-detail pull-left`}>
            <div className="card-detail">
              <div className="card-profile-photo">
                <img className="img-user-comment"
                  src={comment.user.photoURL} alt={comment.user.displayName}
                />
              </div>
              <div className="card-author-name">
                {comment.user.displayName}
              </div>
              <div className="card-text">
                <div className="text-emphasize">''</div>
                <div className="text-simple">{comment.comment}</div>
              </div>
            </div>
          </div>
        ))
      )
    }
    return <div> No review </div>
  }

  render() {
    const { user, data, post } = this.state;
    return (
      <div>
        <div className="card-text">
          <div className="header-text">UrView Reviews</div>
          <div className="spacing">{this.generateComments(data)}</div>
        </div>
        <div className={`${user.email ? 'showing' : 'hiding'} editor`}>
          <div>
            <img src={user.photoURL} alt={user.displayName} />
            <div>{`${user.displayName} says:`}</div>
          </div>
          <textarea
            placeholder="ADD COMMENT.."
            onChange={(e) => this.handleChange(e)}
            value={`${post || ''}`}
          />
          <div className="btn-bar">
            <button className="btn btn-primary" onClick={() => this.PostComment()}>POST</button>
            <button className="btn btn-secondary" onClick={() => this.ClearComment()}>CLEAR</button>
          </div>
        </div>
      </div>
    );
  }
}

PlaceComments.defaultProps = {
  id: ''
};

PlaceComments.propTypes = {
  id: PropTypes.string,
};

export default PlaceComments;
