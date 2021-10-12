const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const scrollDown=()=>{
  document.getElementById("messages").scrollTop=document.getElementById("messages").scrollHeight
}
document.getElementById("messageform").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("send").setAttribute("disabled", "disabled");
  const message = document.getElementById("enter").value;
  document.getElementById("enter").value = " ";
  socket.emit("sendmessage", message, (message) => {
    console.log(message);
  });
  document.getElementById("send").removeAttribute("disabled");
  document.getElementById("enter").focus();
  // console.log('button cliked')
});

socket.on("message", (message) => {
  const screen = document.getElementById("messages");
  const temp = document.getElementById("messagetemplate");
  const html = Mustache.render(temp.innerHTML, {
    message: message.text,
    createdAt: moment(message.createdAt).format("ddd h:mm a"),
    username:message.username
  });
  screen.insertAdjacentHTML("beforeend", html);
  console.log(message);
  scrollDown()
});
socket.on("locationformat", (link) => {
  const screen = document.getElementById("messages");
  const temp = document.getElementById("messagetemplate2");
  const html = Mustache.render(temp.innerHTML, {
    link: link.location,
    username:link.username,
    createdAt: moment(link.createdAt).format("ddd h:mm a"),
  });
  screen.insertAdjacentHTML("beforeend", html);
  console.log(link);
  scrollDown()
});
document.getElementById("location").addEventListener("click", () => {
  if (!navigator.geolocation) return console.log("no support");
  document.getElementById("location").setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(
    (l) => {
      socket.emit(
        "location",
        {
          lat: l.coords.latitude,
          long: l.coords.longitude,
        },
        () => {
          console.log("location shared");
        }
      );
      //   console.log(l);
    },
    (e) => {
      console.log("error sending location" + e);
    }
  );
  document.getElementById("location").removeAttribute("disabled");
});
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
  
  location.href='/'
  }
});
socket.on('roomdata',(data)=>{
  const template=document.getElementById("messagetemplate3").innerHTML
 const html=Mustache.render(template,{
   room:data.room,
   users:data.users
 })

document.getElementById('sidebar').innerHTML=html
})
