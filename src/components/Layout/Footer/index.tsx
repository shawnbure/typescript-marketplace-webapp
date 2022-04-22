import { routePaths } from 'constants/router';
import { Link } from "react-router-dom";


export const Footer = () => {
  return (
    <footer className="c-footer">
      <div>
          <p className="u-text-small u-tac">
            Copyright © {new Date().getFullYear()} Youbei 
            
            &nbsp; &nbsp; 
            |

              <a href="mailto:youbei-support@elrondnft.io?subject=Youbei - Feedback" className="c-navbar_list-link">Support</a>
            |
            
            <a href="https://docs.youbei.io/" className="c-navbar_list-link" target="_blank">Docs</a>
            |

            <a href="https://elrondnft.io/" target="_blank" className="c-navbar_list-link">Made with ❤️ by the ENFT DAO</a>
          </p>
      </div>
    </footer>
  );
};

export default Footer;
