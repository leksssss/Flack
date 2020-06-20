document.addEventListener('DOMContentLoaded', ()=>{
    //Connect to websocket
    var socket=io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect',()=>{
        document.querySelector('form').onsubmit=()=>{
            request.open('POST','/login')

            request.onload=(username)=>{
                localStorage.setItem('username', true);
                socket.emit('{username}')
            }
            
        }
    });
});