const socket = io.connect(location.origin);
//console.log(location)
// dom
const message = document.querySelector('#message'),
  handle = document.querySelector('#name'),
  btn = document.querySelector('#send'),
  output = document.querySelector('#output'),
  chat = document.querySelector('#chat'),
  feedback = document.querySelector('#feedback'),
  clean = document.querySelector('#clean');
  time = document.querySelector('#time');
  userstatus = document.querySelector('#userstatus');

//Add event for sending message on enter
message.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.keyCode == 13) {
    btn.click();
  }
});

//chat.style.overflow = 'hidden';
chat.scrollTop = chat.scrollHeight;

btn.addEventListener('click', () => {

  if (message.value != '' && handle.value != '') {

    socket.emit('chat', {
      message: message.value,
      handle: handle.value
    });
  } else {
    alert('All fields are required!');
  }
  message.value = '';
});

//Set background image
function readURL(event) {
  var getImagePath = URL.createObjectURL(event.target.files[0]);
  chat.style.backgroundImage = 'url(' + getImagePath + ')';
}


message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
});

socket.on('chat', data => {
  //console.log(data);

  chat.innerHTML += `<div class="msg">
        <div class="output" id="output">
        <strong>${data.name}: </strong>${data.message}   
          </div>
        <div class="time" id="time">
        <b>${data.createdAt}</b>
        </div> 
    </div>`;
  chat.scrollTop = chat.scrollHeight;
});

let timer = setTimeout(makeNoTypingState, 1000);

socket.on('typing', (data) => {
  feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
  clearTimeout(timer);
  timer = setTimeout(makeNoTypingState, 1000);
});

socket.on('user left', (data) => {
  if (data.user == 1) {
    userstatus.innerHTML = `<p><em>Only <strong>YOU</strong> are <span>ONLINE</span> at the moment!</em></p>`;
  } else {
    userstatus.innerHTML = `<p><em><strong>${data.user}</strong> users <span>ONLINE</span> now</em></p>`;
  }

});

socket.on('user joined', (data) => {
  if (data.user == 1) {
    userstatus.innerHTML = `<p><em>Only <strong>YOU</strong> are <span>ONLINE</span> at the moment!</em></p>`;
  } else {
    userstatus.innerHTML = `<p><em><strong>${data.user}</strong> users <span>ONLINE</span> now</em></p>`;
  }
});

function makeNoTypingState() {
  feedback.innerHTML = "";
}