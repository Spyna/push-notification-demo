import React from "react";
import "./App.css";
import PushNotificationDemo from "./PushNotificationDemo";

function App() {
  return (
    <div className="App">
      <h1>React Web Push notification demo</h1>
      <p>
        <a href="https://itnext.io/an-introduction-to-web-push-notifications-a701783917ce">Read the docs</a> -{` `}
        <a href="https://github.com/Spyna/push-notification-demo">View the source code</a>
      </p>
      <PushNotificationDemo />
    </div>
  );
}

export default App;
