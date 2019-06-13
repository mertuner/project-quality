import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout/layout'
import { BrowserRouter } from 'react-router-dom';
import * as actions from './store/actions/auth';
import { connect } from 'react-redux';


class App extends Component {

  componentWillMount(){
    this.props.onPageMount();
  }



  render() {
    return (
      <BrowserRouter>
        <div className='h-auto'>
          <Layout />
        </div>
      </BrowserRouter>
    );
  }
}



const mapDispatchToProps = dispatch => {
  return {
      onPageMount: () => dispatch( actions.onPageLoad()),
  };
};

export default connect(null, mapDispatchToProps )( App );
