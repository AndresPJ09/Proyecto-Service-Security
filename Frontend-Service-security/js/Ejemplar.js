function save(){
    var data = {
        'estado' : $('#estado').val(),
        'libro': {
            'id': $('#libro_id').val(),
        },
        'state' : $('#state').val() == 1 ? true : false 
    };

    var jsonData = JSON.stringify(data);

    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/ejemplar',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: jsonData,
        success: function (data) {
            alert("Registro exitoso");
            loadData();
            clearData();
        },
        error: function (error) {
            console.error('Error al registrar', error)
        }
    });
}

function update(){
    var data = {
        'estado' : $('#estado').val(),
        'libro': {
            'id': $('#libro_id').val(),
        },
        'state': parseInt ($('#state').val()),
    };

    var id = $('#id').val();
    var jsonData = JSON.stringify(data);

    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/ejemplar/' + id, 
        method: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: jsonData,
        success: function (result) {
            alert("Actualización exitosa");
            loadData();
            clearData();

            // actualizar botón
            var btnAgregar = $('button[name="btnAgregar"]');
            btnAgregar.text('Agregar');
            btnAgregar.attr('onclick', 'save()');
        },
        error: function (error) {
            console.error("Error al actualizar el registro:", error);
        }
    });
}

function loadData(){
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/ejemplar', 
        method : 'GET',
        dataType : 'json',
        success : function(response){
            var html = '';
            var data = response.data;

            if(Array.isArray(data)){
                data.forEach(function(item){
                    html += `<tr>
                    <td>${item.estado}</td>
                    <td>${item.libro.titulo}</td>
                    <td>${item.state === true ? 'Activo': 'Inactivo'}</td>
                    <td><button onclick="findById(${item.id})">Editar</button></td>
                    <td><button onclick="deleteById(${item.id})">Eliminar</button></td>
                    </tr>`;
                 });
            } else {
                console.error('El atributo "data" no es un arreglo', data);
            }
            $('#resultData').html(html);
        },
        error : function (error){
            console.error('Error al cargar: ',error);
        }
    });
}



function loadLibro(){
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/libro', 
        method : 'GET',
        dataType : 'json',
        success : function (response){
            var options = '';
            if(response.status && Array.isArray(response.data)){
                response.data.forEach(function(libro){
                    options += `<option value="${libro.id}">${libro.titulo}</option>`;
                });
                $('#libro_id').html(options);
            } else {
                console.error('La estructura no es la esperada: ', response);
            }
        },
        error : function(error){
            console.error('Error al cargar los ejemplars');
        }
    });
}

function findById(id){
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/ejemplar/' + id, 
        method :'GET',
        dataType : 'json',
        success :function(data){
            $('#id').val(data.data.id);
            $('#estado').val(data.data.estado);
            $('#libro_id').val(data.data.libro.id);
            $('#state').val(data.data.state === true ? 1 : 0); 

            var btnAgregar = $('button[name="btnAgregar"]');
            btnAgregar.text('Actualizar');
            btnAgregar.attr('onclick', 'update()');
        },
        error: function (error){
            console.error('Error al registrar:', error)
        }
    });
}

function deleteById(id) {
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/ejemplar/' + id,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function(result) {
        alert("Registro eliminado exitoso");
        loadData();
        clearData();
    }).fail(function(xhr, status, error) {
        console.error("Error al eliminar el registro:", error);
    });
}


function clearData(){
    $('#id').val('');
    $('#estado').val('');
    $('#libro_id').val('');
    $('#state').val('');
}

