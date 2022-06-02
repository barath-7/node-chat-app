const genereateMessage = (text) =>{
    return {
        text,
        // createdAt:new Date().toLocaleTimeString()
        createdAt:new Date().getTime()
    }
}

module.exports={
    genereateMessage
}