function populateChatMessage(time, username, msg, isSelf) {
    if (isSelf) {
        $('.chat-history ul').append('<li class="clearfix"><div class="message-data align-right"><span class="message-data-time">' +
        time + ', Today</span> &nbsp; &nbsp;<span class="message-data-name">' +
        username + '&nbsp;</span><i class="fa fa-circle me"></i></div><div class="message other-message float-right">' + 
        msg + '</div></li>')
    } else {
        $('.chat-history ul').append('<li><div class="message-data"><span class="message-data-name"><i class="fa fa-circle online"></i> ' + 
        username + '</span><span class="message-data-time">' + 
        time + '</span></div><div class="message my-message">' + 
        msg + '</div></li>')
    }
}

function scrollToBottom() {
    $('.chat-history').animate({
        scrollTop: $('.chat-history')[0].scrollHeight - $('.chat-history')[0].clientHeight
    }, 500)
}

function addNewChat(isMale, name, timeJoined, id) {
    var timeFrom = moment(timeJoined,'D/MM/YYYY hh:mm A').fromNow()
    var image = isMale ? 'male' : 'female'
    $('.new-chats ul.list').append('<li class="clearfix" id="' + id + '"><img src="static/images/' + 
    image + '.png" height="45" width="45" alt="avatar" /><div class="about"><div class="name">' + 
    name + '</div><div class="traits"><i class="fa fa-thumb-tack new-joiner"></i> ' + 
    timeFrom + '</div></div></li>')
}

function addToOwnChat(isMale, name) {
    var image = isMale ? 'male' : 'female'
    $('.owned-chats ul.list').prepend('<li class="clearfix"><img src="static/images/' + 
    image + '.png" height="45" width="45" alt="avatar" /><div class="about"><div class="name">' +
    name + '</div><div class="status"><i class="fa fa-circle online"></i> Just joined</div></div></li>')
}

var socket = undefined

$(document).ready(function(){

    if ($('.chat-history').length) {
        scrollToBottom()
    }

    $('form[class="form-signin"]').submit(function(e){
        $('p[id="error-msg"]').text('')
        e.preventDefault()
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                email: $('input[id="inputEmail"]').val(),
                password: $('input[id="inputPassword"]').val()
            },
            accepts:{
                text: 'application/json; charset=utf-8'
            },
            success: function(result){
                location.href = result.redirect
            },
            error: function(xhr){
                $('p[id="error-msg"]').text(xhr.responseJSON.message || 'something went wrong')
            }   
        })
    })

    $('button[id="button"]').click(function(){
        $.ajax({
            url: '/api/test',
            type: 'POST',
            data: {
                email: 'email',
                password: 'password'
            },
            accepts:{
                text: 'application/json; charset=utf-8'
            },
            success: function(result){
                location.href = result.redirect
            },
            error: function(xhr){
                $('p[id="error-msg"]').text(xhr.responseJSON.message || 'something went wrong')
            }   
        })
    })

    $('#notes-button').click(function(){
        var notes = $('#notes-to-send').val()
        if (notes === '') {
            return
        } else {
            var timeNow = moment().format('D/MM/YYYY HH:mm')
            $('.right-notes').append('<p><span>[' + timeNow + ']</span><i>' + Cookies.get('username') + ':</i> ' + notes + '</P>')
            $('#notes-to-send').val('')
        }
    })

    $('#notes-to-send').keyup(function(event){
        if(event.keyCode == 13){
            $( '#notes-button' ).trigger( 'click' )
        }
    })

    $('#message-button').click(function(){
        var notes = $('#message-to-send').val()
        if (notes === '') {
            return
        } else {
            var timeNow = moment().format('h:mm A')
            populateChatMessage(timeNow, Cookies.get('username'), notes, true)
            socket.emit('sendMsg', {
                id: $('div.sidenav.right div.right-details div.form input#id').val(),
                msg: notes
            })
            $('#message-to-send').val('')
            scrollToBottom()
        }
    })

    $('#message-to-send').keyup(function(event){
        if (event.keyCode == 13) {
            $('#message-button').trigger('click')
        }
    })

    $('#logout').click(function() {
        location.href= '/'
    })

    if(window.location.href.endsWith('/home.html')){
        socket = io.connect()
        socket.on('newChat', function(data){
            console.log(JSON.stringify(data, null, 4))
            localStorage.setItem(data.id, JSON.stringify(data))
            addNewChat(data.gender === 'Male', data.name, data.timeNow, data.id)
            $('.new-chats li[id="'+ data.id +'"]').click(function(){
                var id = $(this).attr('id')
                var data = JSON.parse(localStorage.getItem(id))
                $('#new-chat-details input#name').val(data.name)
                $('#new-chat-details input#age').val(data.age)
                $('#new-chat-details input#gender').val(data.gender)
                $('#new-chat-details input#reason').val(data.reason)
                $('#new-chat-details input#id').val(data.id)
                $('#new-chat-details').modal('show')
            })
        })
        socket.on('newMsg', function(data){
            console.log(JSON.stringify(data, null, 4))
            var time = moment(data.timeNow,'D/MM/YYYY hh:mm A').format('h:mm A')
            populateChatMessage(time, data.name, data.msg, false)
        })
    }

    $('#pick-up-new-chat').click(function(){
        var id = $('#new-chat-details input#id').val()
        $('.new-chats li[id="'+ id +'"]').remove()
        $('#new-chat-details').modal('hide')
        var data = JSON.parse(localStorage.getItem(id))
        addToOwnChat(data.gender === 'Male', data.name)
        // Populate first
        $('div.sidenav.right .header-message div#name').text('Chat with ' + data.name)
        $('div.sidenav.right div.right-details div.form input#age').val(data.age.toString() + ' years old')
        $('div.sidenav.right div.right-details div.form input#gender').val(data.gender)
        $('div.sidenav.right div.right-details div.form input#reason').val(data.reason)
        $('div.sidenav.right div.right-details div.form input#id').val(data.id)

        $('div.blank#default').hide()
        $('div#details').show()
        // Add to owned chats and reveal the left sides
    })

})