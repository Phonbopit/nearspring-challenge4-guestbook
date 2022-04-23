import React from "react";

export default function SignIn() {
  return (
    <>
      <p>
        This is modified version of Guestbook for{" "}
        <a href="https://nearspring.splashthat.com/">
          NEAR Spring Challenge #4
        </a>
      </p>
      <p>
        This app demonstrates a key element of NEAR’s UX: once an app has
        permission to make calls on behalf of a user (that is, once a user signs
        in), the app can make calls to the blockchain for them without prompting
        extra confirmation. So you’ll see that if you don’t include a donation,
        your message gets posted right to the guest book.
      </p>
      <p>
        But if you do add a donation, then NEAR will double-check that you’re ok
        with sending money to this app.
      </p>
      <p>Go ahead and sign in to try it out!</p>
    </>
  );
}
