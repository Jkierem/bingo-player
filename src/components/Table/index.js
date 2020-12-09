import React, { useState } from 'react'
import { range } from 'ramda';
import getClassName from 'getclassname'
import "./Table.scss"

const Table = (props) => {
    const { bingo } = props
    const [selected, setSelected] = useState({})

    const toggle = (x) => setSelected({ ...selected, [x]: !selected[x] });

    const getCellClass = x => getClassName({
        base: "table__body__cell",
        "&--on": selected[x]
    })

    return (
    <div className="table">
        <div className="table__heading">
            {"LATIR".split("").map((value) => {
                return <div key={value} className="table__heading__cell">
                    {value}
                </div>
            })}
        </div>
        <div className="table__body">
            {range(0,25).map((value,idx) => {
                return <div key={idx} className={getCellClass(value)} onClick={() => toggle(value)}>
                    {bingo[value]}
                </div>
            })}
        </div>
    </div>)
}

export default Table