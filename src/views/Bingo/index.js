import Table from "../../components/Table"

const Bingo = ({ bingo=[] }) => {
    return <div>
        <Table bingo={bingo} />
    </div>
}

export default Bingo;