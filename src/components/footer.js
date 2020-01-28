import React from "react";

const Footer = () => (
  <footer className="footer">
    <div className="content has-text-centered">
      <p>
        <strong>The Portfolio of Daniel Ruxton</strong>
      </p>
      <p>
        © {new Date().getFullYear()}, Proudly Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </p>
    </div>
  </footer>
);

export default Footer;
