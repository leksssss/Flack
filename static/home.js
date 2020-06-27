document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#popup').style.display="none";
    //document.querySelector('.m').style.display='none';
    const a=document.querySelector('#popup');
    a.style.animationPlayState='paused';
    
    document.querySelector('#create').onclick=()=>{
        a.style.animationPlayState='running';
        document.getElementById('popup').style.display = 'block';
    };

    //alert while deleting account
    document.querySelector('#del').onclick=()=>{
        alert("Your account will be deleted. Thank you for using FLACK!");
        window.localStorage.clear();
        window.location=location.protocol + '//' + document.domain + ':' + location.port + '/delete';
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
    //When a join is clicked,show user has joined.
        document.querySelector('#join').onclick=() => {
            const room=document.querySelector('.m').querySelector('.curchannel').innerHTML;
            if(!window.localStorage.getItem(`${room}`)){
                window.localStorage.setItem(`${room}`,`${room}`);
                socket.emit("join",{"room":room});
            }
            else
                alert("You're already a member!");
        };

        //When leave is clicked, show user has left and clear localstorage
        document.querySelector('#leave').onclick =()=>{    
            const room=document.querySelector('.m').querySelector('.curchannel').innerHTML;
            if(!window.localStorage.getItem(`${room}`)){
               alert("You need to join the channel");
            }
            else{
                window.localStorage.removeItem(`${room}`);
                socket.emit('leave',{"room":room});
            }
        };

        //When a user sends a message, emit event
        document.querySelector('#send').onclick= ()=>{
            const text=document.querySelector('#chat').value;
            const ch=document.querySelector('.m').querySelector('.curchannel').innerHTML;
            if(window.localStorage.getItem(`${ch}`)){    
                document.querySelector('#chat').value='';
                socket.emit('msg sent',{"text":text,"ch":ch});
                //stop form from submitting
                return false;
            }
            else
                alert("You need to join the channel to start chatting.");
        };
    });

    //When a user joins, broadcast to everyone in the channel
    socket.on('join event',data => {
        const p=document.createElement('p');
        p.innerHTML=`${data.username} has joined. Nice to have you here in ${data.room}`;
        p.style.color="ivory";
        p.style.fontStyle="italic";
        document.querySelector('.prev-msg').append(p);
    });

    //When user leaves,show the message
    socket.on('leave event',data => {
        const p=document.createElement('p');
        p.innerHTML=`${data.username} has left ${data.room}`;
        p.style.color="ivory";
        p.style.fontStyle="italic";
        document.querySelector('.prev-msg').append(p);
    });

    //On receiving new message, broadcast to everyone
    socket.on('new message', data =>{
        var obj=data
        const p1=document.createElement('p');
        const p2=document.createElement('p');
        p1.innerHTML=`${obj.name} - ${obj.time}`;
        p2.innerHTML=`${obj.msg}`
        p1.style.color=randColor();
        p2.style.color="ivory";
        p1.append(p2);
        document.querySelector('.prev-msg').append(p1);
        
    });

    //assigning random colors to usernames
    document.querySelectorAll('.color').forEach( p => {
        p.style.color=randColor();
    });

    //function to generate random colors
    function randColor() {
        let x = Math.floor(Math.random() * 256);
        let y = Math.floor(Math.random() * 256);
        let z = Math.floor(Math.random() * 256);
        return "rgb(" + x + "," + y + "," + z + ")";
    }

});