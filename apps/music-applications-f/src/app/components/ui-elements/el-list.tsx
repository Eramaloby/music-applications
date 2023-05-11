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
            {list.map((post) => 
                <ListItem item={post}></ListItem>)}
        </div>
     );
}

export default ElementList;