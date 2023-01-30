import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate, Link } from "react-router-dom";

import { removeItem } from "../../utils/Functions";
import { paths } from "../../Router/Constant";
import { Authorization } from "../../utils/Functions";
import { useDispatch } from "react-redux";
import { logout } from "../../pages/Login/actions";

function DefaultLayout(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    navigate(paths.login);
  };
  const RenderNavLink = () => {
    if (Authorization()) {
      return (
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={paths.home}>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to={paths.category}>
              Category
            </Nav.Link>

            <Nav.Link as={Link} to={paths.expense}>
              Expense
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={logoutHandler} className="ml-auto">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      );
    } else {
      return (
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={paths.login}>
              Login
            </Nav.Link>
            <Nav.Link as={Link} to={paths.register}>
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      );
    }
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={paths.home}>
          Expense Tracker App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <RenderNavLink />
      </Container>
    </Navbar>
  );
}

export default DefaultLayout;
