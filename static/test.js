// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// When connected, configure buttons
socket.on('connect', () => {
    //alert(`Welcome!`);
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
        button.setAttribute("id","disp");
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

    //Opening the channel when clicked on it
    document.querySelectorAll('#disp').forEach(button => {
        button.onclick= ()=>{
            let next_channel=document.querySelector('button').value;
            socket.emit('channel info',{"next_channel":next_channel});
        }
    }); 
    
    //Client side redirection
    socket.on('redirect',data =>{
        window.location=data.url;
    });

    if channelMessages["cur_channel"] is None:
        text="Start a conversation"
        x=datetime.datetime.now()
        time=x.strftime("%X")
        channelMessages=deque()
        channelMessages["cur_channel"]=cur_channel
        channelMessages["msgs"]={"name":username,"time":time,"msg":text}        