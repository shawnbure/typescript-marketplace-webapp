import { routePaths } from 'constants/router';
import { Link } from "react-router-dom";


export const Footer = () => {
  return (
    <footer className="c-footer">
      <div>
          <p className="u-text-small u-tac">
            Copyright © 2022 Youbei 
            
            &nbsp; &nbsp; 
            |

              <a href="mailto:youbei-support@elrondnft.io?subject=Youbei - Feedback" className="c-navbar_list-link">feedback</a>

          </p>
      </div>
    </footer>
  );
};

export default Footer;
