
import { Link } from 'react-router-dom';


// import { Props } from './interfaces';


export const Card: (props: any) => any = ({
    mediaSrcPath,
    creatorAvatarSrcPath,
    title,
    collectionName,
    collectionLink,
    cardLinkTarget,
    classNames,
}) => {

    return (

        <Link to={cardLinkTarget}>

            <div className={`c-card ${classNames}`}>

                <div className="c-card_img-container">
                    <img src={mediaSrcPath}  className="c-card_img" alt="" />
                </div>

                <div className="c-card_info">
                    <img src={creatorAvatarSrcPath} className="c-card_creator-avatar" alt="" />
                    <div className="c-card_details">
                        <span className="c-card_title">
                            {title}
                        </span>
                        <span className="c-card_collection-name">
                            <Link to={collectionLink}>
                                {collectionName}
                            </Link>
                        </span>
                    </div>
                </div>


            </div>

        </Link>


    );

};

export default Card;
