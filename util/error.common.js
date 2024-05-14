module.exports.catchError = (err)=>{
    return {message:"error",error:err}
}

module.exports.successNoData = ()=>{
    return {message:"No data found"}
}