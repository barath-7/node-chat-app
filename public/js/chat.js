const socket = io();

let display = document.getElementById("display");
let inputField = document.getElementById("input");
let form = document.getElementById("form");
let getLocation = document.getElementById("location");
let submitButton = document.getElementById("submit-button");
let messageTemplate = document.querySelector("#message-template").innerHTML;
let locationTemplate = document.querySelector("#location-template").innerHTML;
let sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

let { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  let newMessage = display.lastElementChild;
  let newMessageStyle = getComputedStyle(newMessage);
  let newMessageMargin = parseInt(newMessageStyle.marginBottom);
  let newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  let visibleHeight = display.offsetHeight;
  let containerHeight = display.scrollHeight;
  let scrollOffset = display.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    display.scrollTop = display.scrollHeight;
  }
};
socket.on("message", (message) => {
  // console.log(welcomeMsg)
  //  display.innerHTML = welcomeMsg;
  let html = Mustache.render(messageTemplate, {
    message: message.text,
    // time:message.createdAt
    time: moment(message.createdAt).format("h:mm a"),
    username: message.username,
  });
  display.insertAdjacentHTML("beforeend", html);
  autoscroll();
});
socket.on("locationMessage", (locationMessage) => {
  let html = Mustache.render(locationTemplate, {
    locationMessage: locationMessage.message,
    time: moment(locationMessage.createdAt).format("h:mm a"),
    username: locationMessage.username,
  });
  display.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let enteredData = inputField.value;
  if (enteredData === "" || enteredData == null || enteredData == undefined) {
    return;
  }
  submitButton.setAttribute("disabled", "disabled");
  //let enteredData=event.target.elements.messageInput

  socket.emit("clientMessage", enteredData, () => {
    submitButton.removeAttribute("disabled");
    inputField.value = "";
    inputField.focus();
  });
});

socket.on("roomData", ({ room, users }) => {
  let html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
