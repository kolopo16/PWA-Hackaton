import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchBox extends Component {
  constructor() {
    super();
    this.state = {
      keywords: '',
    };
  }
  onInputChange(e) {
    if(e.charCode === 13) {
      this.setState({ keywords: e.target.value }, () => {
        this.props.onInputChange(this.state.keywords);
      });
    }
  }

  render() {
    return (
      <div className="search-box">
        <input
          type="text"
          className="text-box"
          placeholder="SEARCH ..."
          onKeyPress={e => this.onInputChange(e)}
        />
      </div>
    );
  }
}

SearchBox.propTypes = {
  onInputChange: PropTypes.func,
};

export default SearchBox;
