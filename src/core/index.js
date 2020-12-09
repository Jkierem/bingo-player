import { Either, EnumType, IO } from "jazzi"

const randomInteger = (min,max) => {
    return Math.floor((Math.random() * (max - min)) + min)
}

const GenError = EnumType("GenError",["RangeTooSmall"])
export const genValues = (n,min,max) => {
    if( max - min < n ){
        return Either.Left(GenError.RangeTooSmall)
    }
    const values = []
    while(values.length < n){
        const ri = randomInteger(min,max);
        if( !values.includes(ri) ){
            values.push(ri)
        }
    }   
    return Either.Right(values)
}

export const bingoData = () => {
    return [
        genValues(5,1,16),
        genValues(5,16,31),
        genValues(5,31,46),
        genValues(5,46,61),
        genValues(5,61,76)
    ].flatMap(x => x.get())
}


export const uniqueID = () => {
    const r = () => randomInteger(0,10)
    const uniq = `${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}`;
    return uniq;
}