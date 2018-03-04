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
                alert(xhr)
                alert(result)
                alert(status)
            },
            error: function(xhr, status, error){
                alert(xhr)
                alert(error)
                alert(status)
                
            }   
        })
    })
})