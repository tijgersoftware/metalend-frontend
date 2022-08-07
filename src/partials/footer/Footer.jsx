import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import "./footer.css";

const Footer = () => {
  const { app } = useSelector((state) => state);

  return (
    <div className="footerDiv text-left max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full">
      <div
        className={`text-center md:text-left footerGridDiv grid grid-cols-1 md:grid-cols-5 gap-4 ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="footerLogo">
          <img
            src={`/assets/images/${
              app?.isDarkMode ? "darkLogo.png" : "logo.svg"
            }`}
            className="mx-auto md:mx-0 mb-3 md:mb-0 w-28 h-auto"
            alt=""
          />
        </div>
        <div className="FooterLinkingDiv grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-4">
          <div className="footerList">
            <h6 className="text-skyCus">App</h6>
            <ul className="footerListUl">
              <li>
                <Link to="/" className="text-darkGray dark:text-white">
                  Lending & Borrowing
                </Link>
              </li>
              {/* <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Vote
                </Link>
              </li>
              <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  NFT
                </Link>
              </li>
              <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Content
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="footerList">
            <h6 className="text-skyCus">Docs & Security</h6>
            <ul className="footerListUl">
              <li>
                <a
                  href="docs.metalend.finance"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  Documents
                </a>
              </li>
              {/* <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Github
                </Link>
              </li> */}
              {/* <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Audit
                </Link>
              </li> */}
              {/* <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Bug Bounty
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="footerList">
            <h6 className="text-skyCus">Metalend</h6>
            <ul className="footerListUl">
              <li>
                <a
                  href="https://metalend.finance"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://metalend.finance/team/"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  Team & Investors
                </a>
              </li>
              <li>
                <a
                  href="https://metalend.finance"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>
              </li>
              {/* <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Branding
                </Link>
              </li> */}
              <li>
                <a
                  href="https://metalend.finance/contact/"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  Career
                </a>
              </li>
              <li>
                <a
                  href="https://metalend.finance/contact/"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div className="footerList">
            <h6 className="text-skyCus">Social</h6>
            <ul className="footerListUl">
              <li>
                <a
                  href="https://twitter.com/MetalendFinance"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
              {/* <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Discord
                </Link>
              </li>
              <li>
                <Link to='/' className='text-darkGray dark:text-white'>
                  Instagram
                </Link>
              </li> */}
              <li>
                <a
                  href="https://linkedin.com/company/metalend-finance/"
                  target="_blank"
                  className="text-darkGray dark:text-white"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </a>
              </li>
              <li>
                <Link to="/" className="text-darkGray dark:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full footerCPRYTDiv col-span-2 md:col-span-4 flex flex-col md:flex-row items-center justify-between">
            <ul className="socialIcons flex items-center mb-3 md:mb-0">
              <li>
                <a
                  href="https://twitter.com/MetalendFin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FeatherIcon
                    icon="twitter"
                    className="text-lightGray dark:text-whiter mx-1"
                    size={16}
                  />
                </a>
              </li>
              {/* <li>
                <a
                  href='http://localhost:3000/'
                  target='_blank'
                  rel='noopener noreferrer'>
                  <FeatherIcon
                    icon='youtube'
                    className='text-lightGray dark:text-whiter mx-1'
                    size={16}
                  />
                </a>
              </li> */}
              {/* <li>
                <a
                  href='http://localhost:3000/'
                  target='_blank'
                  rel='noopener noreferrer'>
                  <FeatherIcon
                    icon='instagram'
                    className='text-lightGray dark:text-whiter mx-1'
                    size={16}
                  />
                </a>
              </li> */}
              <li>
                <a
                  href="https://linkedin.com/company/metalend-finance/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FeatherIcon
                    icon="linkedin"
                    className="text-lightGray dark:text-whiter mx-1"
                    size={16}
                  />
                </a>
              </li>
            </ul>
            <p className="text-xs text-darkGray dark:text-white md:mr-10">
              © 2021 All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
