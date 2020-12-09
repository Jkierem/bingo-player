import { Either, Maybe } from "jazzi";
import { compose, path } from "ramda";
import { useState } from "react";
import Button from "../../components/Button";
import { Views } from "../../types";
import { database, auth } from "../../firebase"
import logo from './latir.jpeg'
import './Login.scss';

const doSubmit = (value) => {
    return auth.signInAnonymously()
    .then(() => database.ref("/admin").once("value"))
    .then((snapshot) => snapshot.val() === value)
    .then((admin) => Either.fromFalsy(undefined,admin)
        .map(() => Maybe.Just([Views.Admin, {}]))
        .onLeft(() => {
            return database.ref(`/bingos/${value}`)
                .once("value")
                .then(snap => { 
                    return Maybe.fromPredicate(() => snap.exists(), snap.val())
                        .map((b) => b.split(",").map(Number))
                        .effect(console.log)
                        .map((bingo) => [Views.Bingo,bingo])
                })
        })
    )
}

const Login = ({ setView, setProps }) => {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false)
    const handleChange = compose( setValue, path(["target","value"]));
    const handleSubmit = (e) => {
        e.preventDefault()
        Maybe.fromEmpty(value)
        .effect((data) => {
            setLoading(true)
            doSubmit(data)
            .then((mView) => {
                setLoading(false)
                mView.effect(([view, extra]) => {
                    setView(view)
                    setProps({ bingo: extra })
                }).onNone(() => {
                    setValue("")
                    alert("No se pudo encontrar bingo")
                })
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
        })
    }

    return <form className="login" onSubmit={handleSubmit}>
        <div className="logo">
            <img alt="logo" src={logo} width="120" height="120"/>
        </div>
        <input 
            id="code" 
            placeholder="Codigo de bingo..." 
            value={value} 
            onChange={handleChange}
            className="input"
        />
        <Button loading={loading} onClick={handleSubmit}>Aceptar</Button>
    </form>
}

export default Login;