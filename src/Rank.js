import Stack from '@mui/material/Stack';
import './component.css'

const Rank = ({click}) =>{
    return(
        <div className='rank' onClick={click} >
            <div className='rank1'></div>
            <div className='rank2'></div>
            <div className='rank3'></div>
        </div>
    )
}

export default Rank;