export const formatToPactDate = (dateObject)=>{
    return ((dateObject.toISOString()).slice(0,19).concat("Z"))
}