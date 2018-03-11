function populateChatMessage(time, username, msg, isSelf) {
    if (isSelf) {
        $('.chat-history ul').append('<li class="clearfix"><div class="message-data align-right"><span class="message-data-time">' +
        time + ', Today</span> &nbsp; &nbsp;<span class="message-data-name">' +
        username + '&nbsp;</span><i class="fa fa-circle me"></i></div><div class="message other-message float-right">' + 
        msg + '</div></li>')
    } else {
        $('.chat-history ul').append('li><div class="message-data"><span class="message-data-name"><i class="fa fa-circle online"></i> ' + 
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

function addNewChat(isMale, name, timeJoined) {
    var timeFrom = moment(timeJoined,'D/MM/YYYY').fromNow()
    var image = isMale ? 'male' : 'female'
    $('.new-chats ul.list').append('<li class="clearfix"><img src="static/images/' + 
    image + '.png" height="45" width="45" alt="avatar" /><div class="about"><div class="name">' + 
    name + '</div><div class="traits"><i class="fa fa-thumb-tack new-joiner"></i> ' + 
    timeFrom + '</div></div></li>')
}

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
            var timeNow = moment().format('h:m A')
            populateChatMessage(timeNow, Cookies.get('username'), notes, true)
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
})