import {

  ROLES,

} from "../constants/roles";


// ======================================================
// IS ADMIN
// ======================================================

export const isAdmin =
  (user) => {

    return (

      user?.role ===
      ROLES.ADMIN
    );
  };


// ======================================================
// IS USER
// ======================================================

export const isUser =
  (user) => {

    return (

      user?.role ===
      ROLES.USER
    );
  };


// ======================================================
// CAN ACCESS
// ======================================================

export const canAccess =
  (

    user,

    allowedRoles = []

  ) => {

    if (!user) {

      return false;
    }

    return allowedRoles.includes(
      user.role
    );
  };