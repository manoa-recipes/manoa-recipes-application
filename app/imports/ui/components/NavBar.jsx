import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <Navbar expand="lg" id="nav" width="100%">
      <Container id="text">
        <Navbar.Brand as={NavLink} to="/">
          <Image roundedCircle src="images/manoa-recipes.png" alt="logo" width={75} fluid />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser ? ([
              <Nav.Link id="user-home-nav" as={NavLink} to="/home" key="home">Home</Nav.Link>,
              <Nav.Link id="add-recipes-nav" as={NavLink} to="/add-recipe" key="add">Add Recipe</Nav.Link>,
              <Nav.Link id="list-recipes-nav" as={NavLink} to="/list" key="list">List Recipes</Nav.Link>,
              <Nav.Link id="search-nav" as={NavLink} to="/search" key="search">Search</Nav.Link>,
              <Nav.Link id="vendor-nav" as={NavLink} to="/vendor" key="vendor">Vendors</Nav.Link>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), ['user']) ? (
              <Nav.Link id="user-profile-nav" as={NavLink} to="/user_profile" key="profile">User Profile</Nav.Link>
            ) : ''}
            {Roles.userIsInRole(Meteor.userId(), ['vendor']) ? (
              <Nav.Link id="vendor-profile-nav" as={NavLink} to="/vendor_profile" key="vendor-profile">Vendor Profile</Nav.Link>
            ) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/admin" key="admin">Admin</Nav.Link>
            ) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin">
                  <PersonFill />
                  Sign
                  in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup">
                  <PersonPlusFill />
                  Sign
                  up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="navbar-current-user" title={currentUser}>
                <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
