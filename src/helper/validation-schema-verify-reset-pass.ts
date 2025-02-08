// helper/validation-schema-login.ts
import * as Yup from "yup";

export const verifyResetPass = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, "Old Password must be at least 6 characters")
    .required("Old Password is required"),
  password: Yup.string()
    .min(6, "New Password must be at least 6 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
