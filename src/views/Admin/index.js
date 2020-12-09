import { Maybe } from "jazzi";
import { compose, path, split, toPairs } from "ramda";
import { useState } from "react";
import Button from "../../components/Button";
import Table from '../../components/Table'
import { bingoData, uniqueID } from "../../core";
import { database } from "../../firebase";
import './style.scss'

const getBingo = (code) => {
    return database.ref(`/bingos/${code}`)
        .once('value')
        .then(snap => Maybe.fromPredicate(() => snap.exists(), snap.val()))
}

const getBingos = () => database.ref("/bingos").once("value").then(snap => snap.val());

const createBingo = () => {
    const uniqBingo = (bingos) => {
        const newBingo = `${bingoData()}`
        if (toPairs(bingos).find(([,bingo]) => bingo === newBingo)){
            return uniqBingo(bingos)
        } else {
            return newBingo
        }
    }
    const uniqId = (bingos) => {
        const newId = uniqueID();
        if (Object.keys(bingos).find(x => x === newId)){
            return uniqId(bingos)
        } else {
            return newId
        }
    }
    return getBingos()
        .then((bs) => [uniqId(bs || []),uniqBingo(bs || [])])
        .then(([id,bingo]) => database.ref(`/bingos/${id}`).set(bingo).then(() => [id,bingo]))
}

const Admin = () => {
    const [ tempBingo, setTemp ] = useState("")

    const [ bingos, setBingos ] = useState([])
    const [ loadBingos, setLoadBingos ] = useState(false);

    const [ hist, setHist ] = useState([])

    const [ viz, setViz ] = useState(undefined)
    const [ loadViz, setLoadViz ] = useState(false)

    const [ loadGen , setLoadGen ] = useState(false)

    const handleLoad = (e) => {
        e.preventDefault()
        setLoadBingos(true)
        getBingos()
        .then(Object.keys)
        .then(setBingos)
        .then(() => setLoadBingos(false))
        .catch(() => {
            alert("Error cargando bingos D:")
            setLoadBingos(false)
        })
    }

    const handleGen = () => {
        setLoadGen(true)
        createBingo()
        .then(([id]) => setHist([...hist, id]))
        .catch((err) => {
            console.error(err)
            alert("Error creando bingo, intenta otra vez")
        })
        .finally(() => {
            setLoadGen(false)
        })
    }

    const handleGetBingo = () => {
        Maybe.fromEmpty(tempBingo)
        .effect(() => setLoadViz(true))
        .effect((data) => {
            getBingo(data)
            .then(m => {
                m
                .map(data => data.split(",").map(Number))
                .map(setViz)
                .onNone(() => alert("No se encontro bingo"))
            })
            .then(() => setLoadViz(false))
            .catch(() => {
                alert("Error inesperado")
                setTemp("");
                setLoadViz(false)
            })
        })
    }
    
    return <div className="admin">
        <div>
            <Button loading={loadGen} onClick={handleGen} >Generar Bingo</Button>
        </div>
        <div>
            <Button loading={loadBingos} onClick={handleLoad} >Cargar Bingos existentes</Button>
        </div>
        <div>
            <input 
                className="input"
                value={tempBingo} 
                placeholder="Codigo de bingo..."
                onChange={compose(setTemp, path(["target","value"]))} 
            />
            <Button loading={loadViz} onClick={handleGetBingo}>Visualizar Bingo</Button>
        </div>
        {viz && <div>
            <Table bingo={viz} />
        </div>}
        <div className="horizontal">
            <ul>
                Ultimos generados: 
                {hist.map((x,idx) => <li key={idx}>{x}</li>)}
            </ul>
            <ul>
                Todos los bingos:
                {bingos.map((x,idx) => <li key={idx}>{x}</li>)}
            </ul>
        </div>
    </div>
}

export default Admin;