import { useState } from "react";
import { Views } from "./types";
import { Admin, Bingo, Login } from "./views";
import "./App.scss"

function App() {
  const [view, setView] = useState(Views.Login)
  const [props, setProps] = useState({})
  return (
    <div className="container">
      {view.match({
        Login: () => <Login {...props} setProps={setProps} setView={setView}/>,
        Admin: () => <Admin {...props} setProps={setProps} setView={setView}/>,
        Bingo: () => <Bingo {...props} setProps={setProps} setView={setView}/>
      })}
    </div>
  );
}

export default App;
