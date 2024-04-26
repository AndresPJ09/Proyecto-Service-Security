function save(){
    var data = {
        'ejemplar': {
            'id': $('#ejemplar_id').val(),
        },
        'usuario': {
            'id': $('#usuario_id').val(),
        },
        'fechaReserva' : $('#fecha_reserva').val(),
        'state' : $('#state').val() == 1 ? true : false 
    };

    var jsonData = JSON.stringify(data);

    $.ajax({
        url: 'http://localhost:9000/bibioteca/v1/api/reserva',
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
        'ejemplar': {
            'id': $('#ejemplar_id').val(),
        },
        'usuario': {
            'id': $('#usuario_id').val(),
        },
        'fechaReserva' : $('#fecha_reserva').val(),
        'state': parseInt ($('#state').val()),
    };

    var id = $('#id').val();
    var jsonData = JSON.stringify(data);

    $.ajax({
        url: 'http://localhost:9000/bibioteca/v1/api/reserva/' + id, 
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
        url: 'http://localhost:9000/bibioteca/v1/api/reserva', 
        method : 'GET',
        dataType : 'json',
        success : function(response){
            var html = '';
            var data = response.data;

            if(Array.isArray(data)){
                data.forEach(function(item){
                    html += `<tr>
                    <td>${item.usuario.nombre}</td>
                    <td>${item.ejemplar.estado}</td>
                    <td>${item.fechaReserva}</td>
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


function loadEjemplar(){
    $.ajax({
        url: 'http://localhost:9000/bibioteca/v1/api/ejemplar', 
        method : 'GET',
        dataType : 'json',
        success : function (response){
            var options = '';
            if(response.status && Array.isArray(response.data)){
                response.data.forEach(function(ejemplar){
                    options += `<option value="${ejemplar.id}">${ejemplar.estado}</option>`;
                });
                $('#ejemplar_id').html(options);
            } else {
                console.error('La estructura no es la esperada: ', response);
            }
        },
        error : function(error){
            console.error('Error al cargar los ejemplars');
        }
    });
}

function loadUsuario(){
    $.ajax({
        url: 'http://localhost:9000/bibioteca/v1/api/usuario', 
        method : 'GET',
        dataType : 'json',
        success : function (response){
            console.log("Respuesta de carga de usuarios:", response); 
            var options = '';
            if(response.status && Array.isArray(response.data)){
                response.data.forEach(function(usuario){
                    options += `<option value="${usuario.id}">${usuario.nombre}</option>`;
                });
                $('#usuario_id').html(options);
            } else {
                console.error('La estructura no es la esperada: ', response);
            }
        },
        error : function(error){
            console.error('Error al cargar los usuarios');
        }
    });
}

function findById(id){
    $.ajax({
        url: 'http://localhost:9000/bibioteca/v1/api/reserva/' + id, 
        method :'GET',
        dataType : 'json',
        success :function(data){
            $('#id').val(data.data.id);
            $('#ejemplar_id').val(data.data.ejemplar.id);
            $('#usuario_id').val(data.data.usuario.id);
            $('#fecha_reserva').val(data.data.fechaReserva);
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
        url: 'http://localhost:9000/bibioteca/v1/api/reserva/' + id,
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
    $('#fecha_reserva').val('');
    $('#ejemplar_id').val('');
    $('#usuario_id').val('');
    $('#state').val('');
}

