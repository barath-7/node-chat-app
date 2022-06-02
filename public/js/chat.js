const socket = io();

let display = document.getElementById("display");
let inputField = document.getElementById("input");
let form = document.getElementById("form");
let getLocation = document.getElementById("location");
let submitButton = document.getElementById("submit-button");
let messageTemplate = document.querySelector("#message-template").innerHTML;
let locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message) => {
  // console.log(welcomeMsg)
//  display.innerHTML = welcomeMsg;
let html = Mustache.render(messageTemplate,{
    message:message.text,
    // time:message.createdAt
    time:moment(message.createdAt).format('h:mm a')
})
display.insertAdjacentHTML('beforeend',html)

});
socket.on('locationMessage',(locationMessage)=>{
  let html = Mustache.render(locationTemplate,{
    locationMessage:locationMessage
})
display.insertAdjacentHTML('beforeend',html)
  console.log(locationMessage)
})


form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitButton.setAttribute("disabled", "disabled");
  //let enteredData=event.target.elements.messageInput
  let enteredData = inputField.value;
  socket.emit("clientMessage", enteredData, () => {
    submitButton.removeAttribute("disabled");
    inputField.value = "";
    inputField.focus();
    console.log("message delivered");
  });
});


getLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    let error = {
      message: "Location is not accessible",
    };
    return alert("Location is not accessible");
  }
  getLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((location) => {
    socket.emit(
      "sendLocation",
      `https://google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`,
      () => {
        console.log("Location delivered");
        getLocation.removeAttribute("disabled");
      }
    );
  });
});
