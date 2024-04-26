function save() {
    var data = {
        'titulo': $('#titulo').val(),
        'autor': $('#autor').val(),
        'genero': $('#genero').val(),
        'cantidad': parseInt($('#cantidad').val()),
        'anoPublicacion': $('#ano_publicacion').val(),
        'state': $('#state').val() == '1' ? true : false
    };

    var jsonData = JSON.stringify(data);
    Swal.showLoading();
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/libro',
        method: 'POST',
        contentType: 'application/json',
        data: jsonData,
        success: function (response) {
            Swal.fire('Guardado', 'Registro exitoso', 'success');
            loadData();
            clearData();
        },
        error: function (error) {
            Swal.fire('Error', 'Error al registrar: ' + error.responseText, 'error');
            console.error('Error al registrar', error);
        }
    });
}





function update() {
    var data = {
        'titulo': $('#titulo').val(),
        'autor': $('#autor').val(),
        'genero': $('#genero').val(),
        'cantidad': parseInt($('#cantidad').val()),
        'anoPublicacion': $('#ano_publicacion').val(),
        'state': parseInt($('#state').val())
    };
    var id = $('#id').val();
    var jsonData = JSON.stringify(data);

    Swal.showLoading(); // Muestra el icono de carga
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/libro/' + id,
        method: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: jsonData,
        success: function (result) {
            Swal.fire('Actualizado', 'Actualización exitosa', 'success');
            loadData();
            clearData();
            var btnAgregar = $('button[titulo="btnAgregar"]');
            btnAgregar.text('Agregar');
            btnAgregar.attr('onclick', 'save()');
        },
        error: function (error) {
            Swal.fire('Error', 'Error al actualizar el registro', 'error');
            console.error("Error al actualizar el registro:", error);
        }
    });
}


function loadData() {
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/libro',
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response.data);
            var html = "";
            var data = response.data;
            data.forEach(function (item) {
                // Construir el HTML para cada objeto
                if (!item.deletedAt) {
                    html +=
                        `<tr>
                    <td>${item.titulo}</td>
                    <td>${item.autor}</td>
                    <td>${item.genero}</td>
                    <td>${item.cantidad}</td>
                    <td>${item.anoPublicacion}</td>
                    <td>${item.state === true ? 'Activo' : 'Inactivo'}</td>
                    <td> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="findById(${item.id})"> <img src="../assets/icon/pencil-square.svg" > </button>
                    <button type="button" class="btn btn-secundary" onclick="deleteById(${item.id})"> <img src="../assets/icon/trash3.svg" > </button></td>
                    </tr>`;
                }
            });

            $("#resultData").html(html);
        },
        error: function (error) {
            // Función que se ejecuta si hay un error en la solicitud
            console.error("Error en la solicitud:", error);
        },
    });
}


function findById(id) {
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/libro/' + id,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#id').val(data.data.id);
            $('#titulo').val(data.data.titulo);
            $('#autor').val(data.data.autor);
            $('#genero').val(data.data.genero);
            $('#cantidad').val(data.data.cantidad);
            $('#ano_publicacion').val(data.data.anoPublicacion);
            $('#state').val(data.data.state === true ? 1 : 0);

            var btnAgregar = $('button[name="btnAgregar"]');
            btnAgregar.text('Actualizar');
            btnAgregar.attr('onclick', 'update()');
        },
        error: function (error) {
            console.error('Error al registrar:', error)
        }
    });
}

function deleteById(id) {
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/libro/' + id,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (result) {
        alert("Registro eliminado exitoso");
        loadData();
        clearData();
    }).fail(function (xhr, status, error) {
        console.error("Error al eliminar el registro:", error);
    });
}


function clearData() {
    $('#id').val('');
    $('#titulo').val('');
    $('#autor').val('');
    $('#genero').val('');
    $('#cantidad').val('');
    $('#ano_publicacion').val('');
    $('#state').val('');
    var btnAgregar = $('button[name="btnAgregar"]');
    btnAgregar.text("Agregar");
    btnAgregar.attr("onclick", "save()");

}