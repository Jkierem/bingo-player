import { useState } from "react";
import { Views } from "./types";
import { Admin, Bingo, Login } from "./views";
import "./App.scss"

function App() {
  const [view, setView] = useState(Views.Login)
  const [bingos, setBingos] = useState([])
  const [props, setProps] = useState({})

  const addBingo = (bingo,code) => setBingos([...bingos, { bingo, code }])

  return (
    <div className="container">
      {view.match({
        Login: () => <Login {...props} setProps={setProps} setView={setView} addBingo={addBingo}/>,
        Admin: () => <Admin {...props} setProps={setProps} setView={setView}/>,
        Bingo: () => <Bingo {...props} setProps={setProps} setView={setView} bingos={bingos} addBingo={addBingo}/>
      })}
    </div>
  );
}

export default App;
