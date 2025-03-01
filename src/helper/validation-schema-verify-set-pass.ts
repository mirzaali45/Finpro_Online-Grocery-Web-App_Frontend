import * as Yup from "yup";

export const verifySetPass = Yup.object().shape({
  username: Yup.string()
    .max(200, "Username maximal 15 characters")
    .required("Username is required"),
<<<<<<< HEAD
  firstName: Yup.string().max(200, "First Name maximal 200 characters"),
  // .required("First Name is required"),
  lastName: Yup.string().max(200, "First Name maximal 200 characters"),
  // .required("First Name is required"),
=======
  firstName: Yup.string()
    .max(200, "First Name maximal 10 characters"),
    // .required("First Name is required"),
  lastName: Yup.string()
    .max(200, "Last Name maximal 10 characters"),
    // .required("First Name is required"),
>>>>>>> 98e0645e58e7b7be4ccdae48f028e8cc4a2bc1a5
  phone: Yup.number()
    // .max(200, "Phone must be at least 5ch aracters")
    .required("Phone Number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password is required"),
});

export const verifySetPassProfileGoogle = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password is required"),
});
