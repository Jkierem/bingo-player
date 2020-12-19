import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { range } from 'ramda';
import getClassName from 'getclassname'
import "./Table.scss"

const InnerTable = (props) => {
    const { bingo, selected, setSelected, onSelect } = props

    const toggle = (x) => {
        onSelect?.(x,Boolean(!selected[x]))
        setSelected({ ...selected, [x]: !selected[x] });
    }

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
                return <div key={idx} className={getCellClass(bingo[value])} onClick={() => toggle(bingo[value])}>
                    {bingo[value]}
                </div>
            })}
        </div>
    </div>)
}

const Table = forwardRef((props, ref) => {
    const [selected, setSelected] = useState({})
    useImperativeHandle(ref, () => ({
        toggleCell: (x) => {
            setSelected({...selected, [x]: !selected[x]})
        },
        setCell: (x,state) => {
            setSelected({...selected, [x]: state})
        },
        reset: () => setSelected({})
    }))
    return <InnerTable {...{...props, selected, setSelected}} />
})

export default Table