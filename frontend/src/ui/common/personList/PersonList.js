import React from 'react';

const stuff = [
    {
        id: "1234",
        spotted: 3,
    },
    {
        id: "5678",
        spotted: 2,
    },
    {
        id: "abcd",
        spotted: 1,
    },
]

const PersonList = () => (
    <div className="person-list-wrapper">
        <ul className="person-list">
            {
                stuff.map((entry) => (
                    <li className="person-list-entry" key={entry.id}>
                        <img className="person-list-entry-img" src={require('../../../resources/images/placeholder.png')} />
                        <div className="person-list-entry-texts">
                            <span className="person-list-entry-id">{entry.id}</span>
                            <span className="person-list-entry-spotted">
                                <img className="person-list-entry-spotted-icon" src={require('../../../resources/images/icons/cross.png')} />
                                {entry.spotted}
                            </span>
                        </div>
                    </li>
                ))
            }
        </ul>
    </div>
);

export default PersonList;
