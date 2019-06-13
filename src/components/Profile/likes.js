import React from 'react';
import Card from '../Card/card';

const Likes = (props) => {

    let likedChannels = props.channels.map(card => {
        return (
            <Card
            channel={card.private.channel}
            desc={card.private.description}
            category={card.private.category}
            rating={card.public.rating}
            cid={card.private.id}
            logoUrl={card.private.logoURL}
            comment = {card.public.comments}
            key={card.private.id}
            voted={true}
        />
        )
    })
    return (
        <div className='flex flex-col ml-60 mt-10 mb-8 sm-0:ml-0'>
            {likedChannels}
        </div>
    )
}

export default Likes;