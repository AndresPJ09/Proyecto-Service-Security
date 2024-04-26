function save() {
    var selectedLibroId = parseInt($("#selected_libro_id").val());
    if (isNaN(selectedLibroId) || selectedLibroId === null) {
        console.error("ID de libro no válido");
        return;
    }

    var selectedPersonId = parseInt($("#selected_person_id").val());
    if (isNaN(selectedPersonId) || selectedPersonId === null) {
        console.error("ID de person no válido");
        return;
    }

    console.log(selectedPersonId); // Ahora está en la posición correcta

    try {
        var data = {
            'fechaPrestamo': $('#fecha_prestamo').val(),
            'fechaDevolucion': $('#fecha_devolucion').val(),
            "libro": {
                "id": selectedLibroId
            },
            "person": {
                "id": selectedPersonId
            },
            "state": parseInt($("#state").val())
        };
        var jsonData = JSON.stringify(data);
        Swal.showLoading(); // Muestra el SweetAlert con estado de carga

        $.ajax({
            url: 'http://localhost:9000/service-security/v1/api/prestamo',
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: jsonData,
            success: function (data) {
                Swal.close(); // Cierra el SweetAlert de carga
                Swal.fire({ // Muestra un SweetAlert de éxito
                    title: '¡Éxito!',
                    text: 'Registro agregado con éxito',
                    icon: 'success'
                });
                clearData();
                loadData();
            },
            error: function (error) {
                Swal.close(); // Cierra el SweetAlert de carga
                Swal.fire({ // Muestra un SweetAlert de error
                    title: 'Error',
                    text: 'No se pudo realizar el registro.',
                    icon: 'error'
                });
            },
        });
    } catch (error) {
        console.error("Error obteniendo el préstamo:", error);
        Swal.close(); // Asegúrate de cerrar SweetAlert en caso de excepciones también
    }
}




function clearData() {
    $('#id').val('');
    $('#libro_id').val('');
    $('#person_id').val('');
    $('#fecha_prestamo').val('');
    $('#fecha_devolucion').val('');
    $('#state').val('');
    var btnAgregar = $('button[name="btnAgregar"]');
    btnAgregar.text("Agregar");
    btnAgregar.attr("onclick", "save()");
}


function loadData() {
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/prestamo',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response.data);
            var html = "";
            var data = response.data;
            data.forEach(function (item) {
                // Construir el HTML para cada objecto
                if (!item.deletedAt) {
                    html +=
                        `<tr>
                <td>${item.libro.titulo}</td>
                <td>` + item.person.firstName + `</td>
                <td>` + item.fechaPrestamo + `</td>
                <td>` + item.fechaDevolucion + `</td>
                <td>` + (item.state == true ? "Activo" : "Inactivo") + `</td>
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


function loadLibro() {
    $.ajax({
        url: "http://localhost:9000/service-security/v1/api/libro",
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.status && Array.isArray(response.data)) {
                var libriees = response.data.map(function (libro) {
                    return {
                        label: libro.titulo,
                        value: libro.id
                    };
                });

                // Inicializar el autocompletado en el campo de entrada de texto
                $("#libro_id").autocomplete({
                    source: libriees,
                    select: function (event, ui) {
                        // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
                        $("#selected_libro_id").val(ui.item.value);
                        // Actualiza el valor del campo de entrada con el ID del libro seleccionado
                        $("#libro_id").val(ui.item.label);
                        console.log("ID de libro seleccionado: " + ui.item.value);
                        return false; // Evita la propagación del evento y el formulario de envío
                    }
                });
            } else {
                console.error("Error: No se pudo obtener la lista de libro.");
            }
        },
        error: function (error) {
            // Función que se ejecuta si hay un error en la solicitud
            console.error("Error en la solicitud:", error);
        }
    });
}


function loadPerson() {
    $.ajax({
        url: "http://localhost:9000/service-security/v1/api/person",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status && Array.isArray(response.data)) {
                var personies = response.data.map(function(person) {
                    return {
                        label: person.firstName,
                        value: person.id
                    };
                });
  
                // Inicializar el autocompletado en el campo de entrada de texto
                $("#person_id").autocomplete({
                    source: personies,
                    select: function(event, ui) {
                        // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
                        $("#selected_person_id").val(ui.item.value);
                        // Actualiza el valor del campo de entrada con el nombre de la persona seleccionada
                        $("#person_id").val(ui.item.label);
                        console.log("ID de persona seleccionada: " + ui.item.value);
                        return false; // Evita la propagación del evento y el formulario de envío
                    }
                });
            } else {
                console.error("Error: No se pudo obtener la lista de personas.");
            }
        },
        error: function(error) {
            // Función que se ejecuta si hay un error en la solicitud
            console.error("Error en la solicitud:", error);
        }
    });
  }


function findById(id) {
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/prestamo/' + id,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#id').val(data.data.id);
            $("#selected_employ_id").val(data.data.libro.id);
            $("#libro_id").val(data.data.libro.titulo);
            $("#selected_person_id").val(data.data.person.id);
            $("#person_id").val(data.data.person.firstName+" "+data.data.person.lastName);
            $('#fecha_prestamo').val(data.data.fechaPrestamo);
            $('#fecha_devolucion').val(data.data.fechaDevolucion);
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

function update() {

    var selectedLibroId = parseInt($("#selected_libro_id").val());
    if (isNaN(selectedLibroId) || selectedLibroId === null) {
        console.error("ID de libro no válido");
        return;
    }

    console.log(selectedPersonId);

    var selectedPersonId = parseInt($("#selected_person_id").val());
    if (isNaN(selectedPersonId) || selectedPersonId === null) {
        console.error("ID de libro no válido");
        return;
    }

    var data = {
        "libro": {
            "id": selectedLibroId,
        },
        "person": {
            "id": selectedPersonId
        },
        'fechaPrestamo': $('#fecha_prestamo').val(),
        'fechaDevolucion': $('#fecha_devolucion').val(),
        'state': parseInt($('#state').val())
    };
    var id = $('#id').val();
    var jsonData = JSON.stringify(data);

    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/prestamo/' + id,
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

function deleteById(id) {
    $.ajax({
        url: 'http://localhost:9000/service-security/v1/api/prestamo/' + id,
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
