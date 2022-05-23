const socket = io()


let display = document.getElementById('display')
socket.on('message',(welcomeMsg)=>{
    // console.log(welcomeMsg)
    display.innerHTML=welcomeMsg
})


let inputField = document.getElementById('input')
let form = document.getElementById('form')
let getLocation = document.getElementById('location')

form.addEventListener('submit',(event)=>{
    event.preventDefault()
    //let enteredData=event.target.elements.messageInput
    let enteredData=inputField.value
    socket.emit('clientMessage',enteredData)
})

getLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        let error ={
            message:'Location is not accessible'
        }
        return alert('Location is not accessible')
    }
    navigator.geolocation.getCurrentPosition((location)=>{
        socket.emit('sendLocation',`https://google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`)
    })
})