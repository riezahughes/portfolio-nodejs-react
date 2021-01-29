import React from "react";
import PropTypes from "prop-types";

import Header from "./header";
import Footer from "./footer";
import "../style/style.scss";
import 'bulma/css/bulma.css'

const Layout = ({ children }) => (
  <>
    <Header />
    <section className="section">
      <main className="container container-content">{children}</main>
    </section>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
