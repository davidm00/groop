//0.1.0
//0.1.1
import React from "react";
import * as Env from "./environment";
import Parse from "parse";
import RoutesView from "./Components/RoutesView";
import EmotionTheme from "./Common/EmotionTheme";
import {UserContextProvider} from "./Context/userContext";

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return (
    <EmotionTheme>
      <div className="App">
        <UserContextProvider>
          <RoutesView />
        </UserContextProvider>
      </div>
    </EmotionTheme>
  );
}

export default App;
