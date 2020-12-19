import { Either, EnumType, Maybe } from "jazzi"
import { compose, path } from "ramda"
import { createRef, useEffect, useState } from "react"
import { database } from "../../firebase"
import Button from "../../components/Button"
import Table from "../../components/Table"

const SubmitError = EnumType("SubmitError",["Empty","Repeated"])

const doSubmit = (value) => {
    return database.ref(`/bingos/${value}`)
        .once("value")
        .then(snap => { 
            return Maybe.fromPredicate(() => snap.exists(), snap.val())
                .map((b) => b.split(",").map(Number))
                .effect(console.log)
        })
}

const flex = { display: "flex", flexWrap: "wrap" }
const centeredFlex = { justifyContent: "center", alignItems: "center"}
const verticalFlex = { ...flex, ...centeredFlex, flexDirection: "column" }
const horizontalFlex = { ...flex, ...centeredFlex, flexDirection: "row" }

const Bingo = ({ bingos, addBingo }) => {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [tableRefs, setTableRefs] = useState([]);
    const [error, setError] = useState();
    const refCount = bingos.length

    useEffect(() => {
        setTableRefs(prev => [...prev, createRef()])
    },[bingos,refCount])


    const handleCellSelect = id => (x,state) => {
        tableRefs.filter((_,idx) => idx !== id).forEach(ref => {
            ref.current?.setCell(x,state)
        })
    }
    const handleChange = compose( setError, setValue, path(["target","value"]));
    const handleSubmit = (e) => {
        e.preventDefault()
        Either.fromFalsy(SubmitError.Empty,value)
        .chain(() => {
            return Either.fromPredicate(() => !bingos.find(x => x.code === value),value)
            .mapLeft(() => SubmitError.Repeated);
        })
        .map((code) => {
            setLoading(true)
            return doSubmit(code)
            .then((mBingo) => {
                mBingo.effect(bingo => addBingo(bingo,code))
                .onNone(() => setError("No se pudo encontrar un bingo con ese codigo"))
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setValue("")
                setLoading(false)
            })
        })
        .onLeft(e => {
            e.match({
                Empty: () => { setError("El codigo no puede ser vacio")},
                Repeated: () => { 
                    setError("El bingo ya fue cargado"); 
                    setValue('')
                }
            })
        })
    }

    return <div style={verticalFlex}>
        <div style={horizontalFlex}>
            {bingos.map(({ bingo, code },idx) => {
                return <div style={verticalFlex} key={`bingo-${code}`}>
                    <Table bingo={bingo} onSelect={handleCellSelect(idx)} ref={tableRefs[idx]} />
                    <div>Codigo: {code}</div>
                    <Button onClick={() => tableRefs[idx].current.reset()}>Reiniciar</Button>
                </div>
            })}
        </div>
        <form onSubmit={handleSubmit} style={verticalFlex}>
            <input 
                id="code" 
                placeholder="Codigo de bingo..." 
                value={value} 
                onChange={handleChange}
                className="input"
            />
        </form>
        <Button loading={loading} onClick={handleSubmit}>Agregar Bingo</Button>
        <span 
            style={{ 
                visibility: error ? 'visible' : 'hidden', 
                color: "red", 
                fontSize: "0.9em", 
                paddingTop: "14px"
            }}
        >
            {error}
        </span>
    </div>
}

export default Bingo;