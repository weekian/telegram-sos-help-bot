$(document).ready(function(){
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
                // location.href = result.redirect
                alert('success')
            },
            error: function(xhr){
                alert('failure')
                // $('p[id="error-msg"]').text(xhr.responseJSON.message || 'something went wrong')
            }   
        })
    })
})