import React from "react";
import { SignUp } from "@clerk/clerk-react";

function Signup() {
  return (
    <div className="d-flex justify-content-center">
      <SignUp />
    </div>
  );
}

export default Signup;
