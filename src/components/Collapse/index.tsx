
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from 'classnames';
import { useEffect, useState } from 'react';

export const Collapse: (props: any) => any = ({
    open,
    children
}) => {

    const [ isOpen, setIsOpen ] = useState(Boolean(open));

    const contentGeneratedClasses = classNames("c-collapse_content", {
        "c-collapse_content--open": isOpen
    });

    const icon =  isOpen ? faIcons.faChevronUp : faIcons.faChevronDown;

    const toggleOpen = () => {

        setIsOpen(!isOpen);

    };

    return (

        <div className="c-collapse">
            <div className={contentGeneratedClasses}>
                {children}
            </div>
            <FontAwesomeIcon onClick={toggleOpen} className="c-collapse_icon" style={{ width: 25, height: 25 }} icon={icon} />
        </div>

    );

};

export default Collapse;
