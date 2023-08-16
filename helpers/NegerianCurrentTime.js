import moment from 'moment-timezone';

const NigerianCurrentTimeZone=()=>{
          const today=new Date()
    const inputTz = "Africa/Lagos"
    const time = moment.tz(today, inputTz)
   
//    return time
    const formatDate = moment(time).format('YYYY-MM-DD')
    return formatDate
    
}

export default NigerianCurrentTimeZone;