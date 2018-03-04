$(document).ready(function(){
    $('form[class="form-signin"]').submit(function(e){
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
            success: function(result, status, xhr){
                console.log(result)
                console.log(status)
            },
            error: function(xhr, status, error){
                console.log(error)
                console.log(status)
            }   
        })
    })
})