document.addEventListener('DOMContentLoaded',()=>{
   document.querySelector('#popup').style.display="none";

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
        //alert(`Welcome!`);
        document.querySelector('#create').onclick=()=>{
            document.getElementById('popup').style.display = 'block';
        };
        document.querySelector('#createbutton').onclick=()=>{        
            var channelname= document.querySelector('#channelname').value;
            // Clear input field
            document.querySelector('#channelname').value = '';
            // Stop form from submitting
            document.getElementById('popup').style.display = 'none';
            socket.emit('new channel created',{'channelname':channelname});
            return false;
            
        };
        
    });

    //When a new channel is announced
    socket.on('announce channel',data =>{
        localStorage.setItem(`${data.channelname}`,`${data.channelname}`);
        const li=document.createElement('li');
        li.innerHTML=`${data.channelname}`;
        document.querySelector('#channels').append(li);
    });

    //If the channel exists show error message
    socket.on('channel exists',()=>{
        alert(`The channel already exists. Choose another name.`);
        document.getElementById('popup').style.display = 'block';
    });




});