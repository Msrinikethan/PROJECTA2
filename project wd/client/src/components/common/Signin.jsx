import React from "react";
import { SignIn } from "@clerk/clerk-react";

function Signin() {
  return (
    <div className="d-flex justify-content-center">
      <SignIn>
        <img src="https://static.vecteezy.com/system/resources/thumbnails/005/879/539/small_2x/cloud-computing-modern-flat-concept-for-web-banner-design-man-enters-password-and-login-to-access-cloud-storage-for-uploading-and-processing-files-illustration-with-isolated-people-scene-free-vector.jpg"></img>
      </SignIn>
      {/* <SignIn /> */}
    </div>
  );
}

export default Signin;
