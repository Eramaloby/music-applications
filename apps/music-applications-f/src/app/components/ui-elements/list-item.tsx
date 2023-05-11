import React from 'react';

import { Element } from './el-type';
import './list-item.module.scss';

type ItemProps = {
    item: Element
};

const ListItem = ({
    item
}: ItemProps
) => {
    return ( <div className='element'>
        <div className='element-icon'>
            <img src={item.src} height="60" width="60"/>
        </div>
        <div className='element-header'>
            <h2>{item.header}</h2>
        </div>
        <div className='element-content'>
            {item.content}
        </div>
    </div> );
}

export default ListItem;
