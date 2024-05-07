import moment from 'moment-timezone';

const NigerianDateConverter=(date)=>{
        
    const inputTz = "Africa/Lagos"
    const time = moment.tz(date, inputTz)
   
//    return time
    const formatDate = moment(time).add(1, 'months').format('YYYY-MM-DD')
    return formatDate
    
}

export default NigerianDateConverter;