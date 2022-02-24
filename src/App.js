import * as Env from "./environment";
import Parse from "parse";
import Groups from "./Components/Groups";
import Navbar from "./Common/Navbar"

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return (
    <div className="App">
      <Navbar />
      <Groups />
    </div>
  );
}

export default App;
