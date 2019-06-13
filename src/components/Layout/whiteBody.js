import React, { Component } from 'react';
import NavBar from '../Navigation/navigation'
import CategoryCards from '../../containers/Cards/cards';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth';
import Promoted from '../PostDescription/promoted';
import { exitDrop, getPosts} from '../../store/actions/post';
import Spinner from '../UI/spinner';
import Modal from '../Modal/modal';
import Risings from '../PostDescription/risings';
import HeroText from '../HeroTexts/heroText';

class WhiteBody extends Component {


    componentDidMount(){
        this.props.onLoadPosts();
    }

    openModal = () => {
        document.body.classList.add('modal-open');
    }

    hideModal = () => {
        document.body.classList.remove('modal-open');
    }


    render() {

        let cardsByDay = <Spinner />
        if (!this.props.loading) {
            cardsByDay = this.props.dates.map(day => {
                return (
                    <CategoryCards date={day} key={day} {...this.props}/>
                )
            })
        }
        return (
            <div className='pb-6'>
                <NavBar {...this.props} />
                {this.props.exitDrop & !this.props.loading ? <Modal exited={this.props.onExitDrop}/> : null}
                <Risings risingStars = {this.props.risingStars}/>
                <Promoted/>
                <HeroText/>
                <p className='text-base font-semibold absolute pt-10 select-none' style={{fontFamily: 'Open Sans'}}>Top Channels</p>
                {cardsByDay}
                {/* <BottomSection/> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userPopUp: state.user.userPopUp,
        exitDrop: state.post.exitDrop,
        loading: state.post.loading,
        dates: state.post.dates,
        error: state.post.error,
        risingStars: state.post.risingStars
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPosts: () => dispatch(getPosts()),
        onLogOut: () => dispatch(logout()),
        onExitDrop: () => dispatch(exitDrop())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WhiteBody);