import { routePaths } from 'constants/router';
import { Link } from "react-router-dom";


export const Footer = () => {
  return (
    <footer className="c-footer">
      <div>
          <p className="u-text-small u-tac">
            Copyright © 2022 Youbei 
            
            |

            &nbsp;
            <a href={'https://erdseanft.gitbook.io/docs/'} target="_blank" className="">Resources</a>            
            &nbsp;
            |
              <Link to={routePaths.dao} className="c-navbar_list-link">
                ENFT-DAO 
              </Link>

                                    
          </p>
      </div>
    </footer>
  );
};

export default Footer;
