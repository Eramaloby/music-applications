import * as React from 'react';
import { Element } from './el-type';
import ListItem from './list-item';
import './el-list.module.scss';

type ElementListProps = {
    items: Element[];
};

const ElementList = (
    {items: list}: ElementListProps
) => {
    return ( 
        <div className='element-list'>
            {list.map((post, index) => 
                <ListItem item={post} key={index}></ListItem>)}
        </div>
     );
}

export default ElementList;