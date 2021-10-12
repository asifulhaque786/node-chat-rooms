const getMessage=(text,username)=>{
    return {text,createdAt:new Date().getTime(),username}
}
const generateLocation=(location,username)=>{ return{location,createdAt:new Date().getTime(),username}}
module.exports={getMessage,generateLocation}