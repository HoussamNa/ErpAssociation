/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/Association-Dashboard-React-Node
* Copyright 2023 Association Dashboard (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/Association-Dashboard-React-Node/blob/master/LICENSE.md)

* Coded by Association Dashboard

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="https://www.creative-tim.com?ref=adr-admin-footer"
              rel="noopener noreferrer"
              target="_blank"
            >
              الجمعية المغربية لكفالة اليتيم
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">

          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
