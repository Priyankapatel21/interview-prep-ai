import React from 'react'
import { Link } from 'react-router-dom'; // ← Add this import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-600 text-sm py-5 mt-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-evenly gap-1">
        {/* Social Icons */}
        <div className="flex gap-3 text-lg">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookSquare} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>

        {/* Brand Info */}
        <div>&copy;InterviewPrep. All Rights Reserved.</div>

        {/* Links - FIXED: Using Link instead of a href */}
        <div className="flex gap-3">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;