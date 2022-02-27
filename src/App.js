import * as Env from "./environment";
import Parse from "parse";
import RoutesView from "./Components/RoutesView";

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return (
    <div className="App">
      <RoutesView />
    </div>
  );
}

export default App;
