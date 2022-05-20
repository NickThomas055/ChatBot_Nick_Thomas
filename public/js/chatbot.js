// $('#weg').on('click', function (e) {
    
//     var text = $("#send").val();
//     msg(text)
//     var msg = $('<div class="incoming_msg"><div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg"><div class="received_withd_msg"><p>'+ $("#send").val()+ '</p><span class="time_date"> 11:01 AM | Today</span></div></div></div></div>');
//     $('#msgs').append(msg);
    

//     });

 var socket = new WebSocket('ws://localhost:8181/', 'chat');
 var name = 'u1'
    socket.onopen = function () {
        
        name = "name" + Math.floor(Math.random() * Math.floor(700));

        socket.send('{"type": "join", "name":" '+name+'"}');
    }
    $('#weg').on('click', function (e) {
        e.preventDefault();
        
        msg = $('#msg').val();
        if (msg===""){
            msg = "..."
        }
        socket.send('{"type": "msg", "msg": "' + msg + '"}');
        $('#msg').val('');
    });
    socket.onmessage = function (msg) {
      console.debug("WebSocket message received:");
        var data = JSON.parse(msg.data);
        var current = new Date();
        //getPrediction(data.msg);
        
        switch (data.type) {
            case 'msg':
                if (data.name=="MegaBot"){
                var msg = $('<div class="incoming_msg"><div class="incoming_msg_img"> <img src="drive.jpg" alt="driveAI"> </div><div class="received_msg"> <div class="received_withd_msg"> <p>'+data.msg+'</p> <span class="time_date"> '+current.toLocaleTimeString()+'   |    Today</span></div></div></div>');
                } else {
                var msg = $('<div class="outgoing_msg"><div class="sent_msg"><p>'+data.msg+'</p><span class="time_date"> '+current.toLocaleTimeString()+'   |    Today</span> </div></div>');
                }
                $('#msgs').append(msg);
                $(".mesgs").stop().animate({ scrollTop: $(".mesgs")[0].scrollHeight}, 2500);
                
                break;
            case 'join':
                $('#users').empty();
                for (var i = 0; i < data.names.length; i++) {
                    var user = $('<div>' + data.names[i] + '</div>');
                    $('#users').append(user);
                }
                break;
        }
    };




/*var intents = require('./answers.json')
var nachticht: string;
nachricht = nachricht.toLowerCase()
if nachricht.includes(intents)*/
function getanswer(msg){
var intents = require('/answers.json')
var nachricht = msg
nachricht = nachricht.toLowerCase()
for (var j = 0 ;j<intents.answers.length ;j++) {
if (nachricht.includes(intents.answers[j].intent)) {
console.log(intents.answers[j].answer)
}
}
}