document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#popup').style.display="none";
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + '/');

    // When connected, configure buttons
    socket.on('connect', () => {
        alert(`Welcome!`);
        document.querySelector('#create').onclick=()=>{
            document.getElementById('popup').style.display = 'block';
        };
        document.querySelector('#newchannel').onclick=()=>{        
            const channel_name= document.querySelector('#channel_name').value;
            // Clear input field
            document.querySelector('#channel_name').value = '';
            // Stop form from submitting
            return false;
        };
        socket.emit('new channel created',{'channel_name':channel_name});
    });
});
//When a new channel is announced
socket.on('announce channel',data =>{
    const li=document.createElement('li');
    li.innerHTML=`New channel ${data.channel_name} has been created`;
    document.querySelector('#channels').append(li);
    
});

//Function To Display Popup
function div_show() {
    document.getElementById('popup').style.display = 'block';
}

//Function to Hide Popup
function div_hide(){
    document.getElementById('popup').style.display = 'none';
}