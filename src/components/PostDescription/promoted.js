import React, { Component } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Promoted extends Component {


    render() {

        let promotedChannel = null;

        if (this.props.promotedPost) {
            promotedChannel = (
                <div className='md-0:hidden flex flex-col items-end absolute mt-80  w-4/5 ' style={{ fontFamily: 'Open Sans' }}>
                <div className='flex flex-col justify-start'>
                <p className='text-sm font-semibold mb-3'>Featured Channel</p>
                    <div className=' w-76 h-96  flex flex-col justify-around  shadow-md items-center  bg-white rounded'>
                        <Link to = {'/post/' + this.props.promotedPost.private.id}>
                        <div className=' h-28 w-28  rounded ' style={{backgroundImage: `url(${this.props.promotedPost.private.logoURL})`, backgroundSize: 'cover'}}>
                        </div>
                        </Link>
                        <p className='text-grey-darkest font-medium'>{this.props.promotedPost.private.channel}</p>
                        <p className='text-xs text-grey-dark'>{this.props.promotedPost.private.description}</p>
                        <p className='text-xs text-grey-dark'>{this.props.promotedPost.private.category}</p>
                        <div className='flex flex-row  w-32 items-center justify-around'>
                            {this.props.promotedPost.private.facebook ? <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                <a target='_blank' rel="noopener noreferrer" href={this.props.promotedPost.private.facebook}>
                                    <FaFacebook />
                                </a>
                            </IconContext.Provider> : null}
                            {this.props.promotedPost.private.twitter ? <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                <a target='_blank' rel="noopener noreferrer" href={this.props.promotedPost.private.twitter}>
                                    <FaTwitter />
                                </a>
                            </IconContext.Provider> : null}
                            {this.props.promotedPost.private.youtube ? <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                <a target='_blank' rel="noopener noreferrer" href={this.props.promotedPost.private.youtube}>
                                    <FaYoutube />
                                </a>
                            </IconContext.Provider> : null}
                        </div>
                    </div>
                    </div>
                </div>
            )
        }

        return (
            <div>
                {promotedChannel}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        promotedPost: state.post.promotedPost
    };
};


export default connect(mapStateToProps, null)(Promoted);