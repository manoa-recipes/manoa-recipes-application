import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import UserHome from '../pages/homes/UserHome';
import AdminHome from '../pages/homes/AdminHome';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import NotAuthorized from '../pages/NotAuthorized';
import LoadingSpinner from '../components/LoadingSpinner';
import AddRecipe from '../pages/recipe/AddRecipe';
import Vendors from '../pages/Vendors';
import UserProfile from '../pages/Profile';
import VendorProfile from '../pages/VendorProfile';
import ListRecipe from '../pages/recipe/ListRecipe';
import EditRecipe from '../pages/recipe/EditRecipe';
import EditVendorProfile from '../pages/EditVendorProfile';
import ViewRecipe from '../pages/recipe/ViewRecipe';
import EditProfile from '../pages/EditProfile';
import AddProfile from '../pages/AddProfile';
import SearchResults from '../pages/SearchResults';
import ViewIngredient from '../pages/ViewIngredient';
import EditVendorProducts from '../pages/EditProducts';
import AddVendorProducts from '../pages/AddProducts';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/edit_user_profile/:_id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/edit_vendor_profile/:_id" element={<ProtectedRoute><EditVendorProfile /></ProtectedRoute>} />
          <Route path="/edit_vendor_products/:_id" element={<ProtectedRoute><EditVendorProducts /></ProtectedRoute>} />
          <Route path="/add_vendor_products/:_id" element={<ProtectedRoute><AddVendorProducts /></ProtectedRoute>} />
          <Route path="/add_user_profile" element={<ProtectedRoute><AddProfile /></ProtectedRoute>} />
          <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/vendor-profile" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />
          <Route path="/list" element={<ProtectedRoute><ListRecipe /></ProtectedRoute>} />
          <Route path="/add-recipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/vendor" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
          <Route path="/view-recipe/:_id" element={<ProtectedRoute><ViewRecipe /></ProtectedRoute>} />
          <Route path="/view-by-ingredient/:_id" element={<ProtectedRoute><ViewIngredient /></ProtectedRoute>} />
          <Route path="/edit-recipe/:_id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminProtectedRoute ready={ready}><AdminHome /></AdminProtectedRoute>} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

export default App;
