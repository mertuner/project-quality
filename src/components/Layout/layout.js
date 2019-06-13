import React, { Component } from 'react';
import WhiteBody from './whiteBody';
import Auth from '../../containers/Auth/auth';
import SubmitForm from '../../containers/SubmitForm/submitForm';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import SubmitSuccess from '../Redirects/submitSuccess';
import SubmitError from '../Redirects/submitError';
import Submissions from '../Submissions/submission';
import Commmented from '../PostDescription/commented';
import Profile from '../Profile/profile';

class Layout extends Component {


  render() {
    let routes = (
      <Switch>
        <Route path="/post/:id" exact component={Commmented}/>
        <Route path="/login" component={Auth} />
        <Route path="/" exact component={WhiteBody} />
        <Redirect to="/" />
      </Switch>
    );
    let auth = localStorage.getItem('auth');

    if (auth) {
      routes = (
        <Switch>
          <Route path="/post/:id" exact component={Commmented}/>
          <Route path='/submit' component={SubmitForm} />
          <Route path="/submissions"  component={Submissions} />
          <Route path="/user/:id"  component={Profile}/>
          {localStorage.getItem('submissionSuccess') ? <Route path='/success' component={SubmitSuccess} /> : null}
          {localStorage.getItem('submissionFail') ? <Route path='/fail' component={SubmitError} />: null}
          <Route path="/" exact component={WhiteBody} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div className="w-4/5 m-auto h-full">
        {routes}
      </div>
    )
  }
}


//Prevent prerendering page before redirecting

const mapStateToProps = state => {
  return {
    isSubmitted: state.post.submittedPost
  };
};



export default withRouter(connect(mapStateToProps, null)(Layout));
