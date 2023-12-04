import React, { useState } from 'react';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

const CollapsiblePanel = ({ header, children, renderTriggerIcon }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <div onClick={() => setIsOpen(!isOpen)}>
                <p>
                    {header}{renderTriggerIcon ? renderTriggerIcon(isOpen) : null}
                </p>
            </div>
            {isOpen && <div>{children}</div>}
        </div>
    );
};
export default CollapsiblePanel;