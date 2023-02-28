import React from 'react';

import './ListItem.scss';

type ListItemProps = {
    name: string;
};

export default function ListItem({ name }: ListItemProps) {
    return (
        <div className="ListItem__item">
            <p>{name}</p>
        </div>
    );
}
