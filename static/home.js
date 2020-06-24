document.addEventListener('DOMContentLoaded',()=>{
    const a=document.querySelector('#popup');
    a.style.animationPlayState='paused';
    document.querySelector('#popup').style.display="none";
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
        //alert(`Welcome!`);
        document.querySelector('#create').onclick=()=>{
            a.style.animationPlayState='running';
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
        const div=document.createElement('div');
        div.className="row";
        const button=document.createElement('button');
        button.className="btn btn-link";
        var text = document.createTextNode(`${data.channelname}`);
        button.appendChild(text);
        const ele=div.appendChild(button);
        document.querySelector('.container').append(ele);
    });

    //If the channel exists show error message
    socket.on('channel exists',()=>{
        alert(`The channel already exists. Choose another name.`);
        document.getElementById('popup').style.display = 'block';
    });

    document.querySelector('#del').onclick=()=>{
        alert("Your account will be deleted. Thank you for using FLACK!");
        socket.emit('delete account');
    };

    //Notifying that a user has deleted his account
    //socket.on('user deleted', )


});