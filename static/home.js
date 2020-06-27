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
        localStorage.clear();
        window.location=location.protocol + '//' + document.domain + ':' + location.port + '/delete';
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
    //When a channel is clicked,show its messages.
        document.querySelectorAll('#disp').forEach(button => {
            button.onclick=()=>{
                document.querySelector('.m').style.display='inline';
                const room=document.querySelector('legend').innerHTML;
                socket.emit("join",{"room":room});

        }
    });

    

        //When a user sends a message, emit event
        document.querySelector('#send').onclick= ()=>{
            const text=document.querySelector('#chat').value;
            const ch=document.querySelector('.m').querySelector('.curchannel').innerHTML;
            document.querySelector('#chat').value='';
            socket.emit('msg sent',{"text":text,"ch":ch});
            //stop form from submitting
            return false;
        }
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

    document.querySelectorAll('.color').forEach( p => {
        p.style.color=randColor();
    });

    function randColor() {
        let x = Math.floor(Math.random() * 256);
        let y = Math.floor(Math.random() * 256);
        let z = Math.floor(Math.random() * 256);
        return "rgb(" + x + "," + y + "," + z + ")";
    }

});