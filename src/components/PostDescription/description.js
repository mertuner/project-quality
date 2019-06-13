import React, { Component } from 'react';
import Youtube from 'react-youtube';
import MaterialIcon from 'material-icons-react';
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { connect } from 'react-redux';

class DescriptionCard extends Component {

    render() {
        let play_youtube = <div className='md-0:hidden bg-grey-lightest rounded-lg p-6 shadow-custom'>
            <Youtube
                videoId={this.props.videoId.slice(32)}
                opts={{
                    height: '250',
                    width: '350'
                }}
            />
        </div>

        if (this.props.loading) {
            play_youtube = <div className='w-y h-y md-0:hidden bg-grey-lightest rounded-lg  shadow-custom'>

            </div>
        }

        return (
            <div className='bg-white rounded-lg w-2/3 h-96 absolute z-50 flex flex-row items-center justify-around' style={{ fontFamily: 'Nunito' }}>
                {play_youtube}
                <div className='flex flex-row  justify-end' style={{ fontFamily: 'Nunito' }}>
                    <div className='h-80 flex flex-col justify-around  items-center  bg-white rounded-lg'>
                        <div className=' h-32 w-32  rounded' style={{ backgroundImage: `url(${this.props.modalPost.private.logoURL})`, backgroundSize: 'cover' }}>
                        </div>
                        <div className='w-12 flex flex-row items-end justify-around'>
                            <MaterialIcon icon='star' color='#FDBE13' size={19} />
                            <span className='text-grey text-sm font-bold'>{this.props.modalPost.public.rating}</span>
                        </div>
                        <h4 className='text-grey-darkest'>{this.props.modalPost.private.channel}</h4>
                        <p className='text-xs text-center  text-grey'>{this.props.modalPost.private.description}</p>
                        <div className='flex flex-row  w-32 items-center justify-around'>
                            {this.props.modalPost.private.facebook ? <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                <a target='_blank' rel="noopener noreferrer" href={this.props.modalPost.private.facebook}>
                                    <FaFacebook />
                                </a>
                            </IconContext.Provider> : null}
                            {this.props.modalPost.private.twitter ? <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                <a target='_blank' rel="noopener noreferrer" href={this.props.modalPost.private.twitter}>
                                    <FaTwitter />
                                </a>
                            </IconContext.Provider> : null}
                            <IconContext.Provider value={{ color: "grey", className: 'hover:cursor-pointer' }}>
                                <a target='_blank' rel="noopener noreferrer" href={this.props.modalPost.private.youtube}>
                                    <FaYoutube />
                                </a>
                            </IconContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        videoId: state.post.modalPost.private.videoId,
        modalPost: state.post.modalPost
    }
}

export default connect(mapStateToProps, null)(DescriptionCard);