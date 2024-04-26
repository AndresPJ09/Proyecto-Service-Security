document.addEventListener("DOMContentLoaded", function () {
  // Selecciona el elemento select por su id
  var documentTypeSelect = document.getElementById('document_type');

  // Agrega un evento de cambio al elemento select
  documentTypeSelect.addEventListener('change', function () {
    // Llama a la función loadPerson() cuando se selecciona una opción
    loadPerson();
  });
});


function saveCustomer() {
  var selectedPersonId = parseInt($("#selected_person_id").val());
  if (isNaN(selectedPersonId) || selectedPersonId === null) {
    console.error("ID de empleado no válido");
    return;
  }


  try {

    var data = {
      "person": {
        "id": selectedPersonId
      },
      "state": 1
    };

    var jsonData = JSON.stringify(data);
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/customer",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: jsonData,
      success: function (data) {
        alert("Registro agregado con éxito");
        // clearData();
        loadData();
      },
      error: function (error) {
        alert("Error no se pudo realizar el registro.");
        //console.log($("#person_id").val());
      },
    });
  } catch (error) {
    console.error("Error obteniendo el cliente:", error);
  }
}


function loadData() {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/customer",
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
                  <td>` + item.code + `</td>
                  <td>  ${item.person.firstName} ${item.person.lastName}  </td>
                  <td>` + item.person.documentType + `</td>
                  <td>` + item.person.document + `</td>
                  <td>` + (item.state == true ? "Activo" : "Inactivo") + `</td>
                  <td> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="findById(${item.id})"> <img src="/assets/icon/pencil-square.svg" > </button>
                  <button type="button" class="btn btn-secundary" onclick="deleteById(${item.id})"> <img src="/assets/icon/trash3.svg" > </button></td>
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


function loadTypeDocument() {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/enum/tipodocumento",
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var html = "";
      response.forEach(function (item) {
        // Construir el HTML para cada objeto
        html += `<option value="${item}">${item}</option>`;
      });
      $("#document_type").html(html);
      $("#Document_Type").html(html);
    },
    error: function (error) {
      // Función que se ejecuta si hay un error en la solicitud
      console.error("Error en la solicitud:", error);
    },
  });
}


function loadCity() {
  console.log("Ejecutando loadCity");
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/city",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response.status && Array.isArray(response.data)) {
        var cities = response.data.map(function (city) {
          return {
            label: city.name,
            value: city.id // Agrega el ID como valor
          };
        });

        // Inicializar el autocompletado en el campo de entrada de texto
        $("#city_id").autocomplete({
          source: function (request, response) {
            var results = $.ui.autocomplete.filter(cities, request.term);
            if (!results.length) {
              results = [{ label: 'No se encontraron resultados', value: null }];
            }
            response(results);
          },
          select: function (event, ui) {
            // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
            $("#selected_city_id").val(ui.item.value);
            // Actualiza el valor del campo de entrada con el nombre de la persona seleccionada
            $("#city_id").val(ui.item.label);
            console.log("ID de ciudad seleccionada: " + ui.item.value);
            return false; // Evita la propagación del evento y el formulario de envío
          }
        });
      } else {
        console.error("Error: No se pudo obtener la lista de ciudades.");
      }
    },
    error: function (error) {
      // Función que se ejecuta si hay un error en la solicitud
      console.error("Error en la solicitud:", error);
    },
  });
}


function loadGender() {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/enum/gender",
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var html = "";
      response.forEach(function (item) {
        // Construir el HTML para cada objeto
        html += `<option value="${item}">${item}</option>`;
      });
      $("#gender").html(html);
    },
    error: function (error) {
      // Función que se ejecuta si hay un error en la solicitud
      console.error("Error en la solicitud:", error);
    },
  });
}


function loadAddress() {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/enum/address",
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var html = "";
      response.forEach(function (item) {
        // Construir el HTML para cada objeto
        html += `<option value="${item}">${item}</option>`;
      });
      $("#address").html(html);
    },
    error: function (error) {
      // Función que se ejecuta si hay un error en la solicitud
      console.error("Error en la solicitud:", error);
    },
  });
}


function loadPerson() {
  var type = String($("#Document_Type").val());
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/person/filter/" + type,
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response.status && Array.isArray(response.data)) {
        var documents = response.data.map(function (person) {

          return {
            label: person.document + " - " + person.person,
            value: person.document,
            personName: person.person, // Nuevo campo para almacenar el nombre de la persona
            id: person.id // Nuevo campo para almacenar el ID de la persona
          };
        });
        console.log(documents);

        $("#document_id").autocomplete({
          source: function (request, response) {
            var results = $.ui.autocomplete.filter(documents, request.term);
            if (!results.length) {
              results = [{ label: 'No se encontraron resultados', value: null }];
            }
            response(results);
          },
          select: function (event, ui) {
            // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
            $("#selected_person_id").val(ui.item.id);
            // Actualiza el valor del campo de entrada con el documento de la persona seleccionada
            $("#document_id").val(ui.item.value);
            // Actualiza el valor del campo de nombre con el nombre de la persona seleccionada
            $("#name_id").val(ui.item.personName).prop('disabled', true);

            // Cambiar el estado del botón después de seleccionar una opción
            if ($("#selected_person_id").val() != null && $("#selected_person_id").val() !== "") {
              console.log($("#selected_person_id").val());
              $("#searchButton").removeAttr("data-bs-toggle");
              $("#searchButton").off("click").on("click", saveCustomer);
              $("#searchButton").text("save");
            } else {
              console.log($("#selected_person_id").val());
              $("#searchButton").attr("data-bs-toggle", "modal");
              $("#searchButton").text("add");
              // Si no se encontraron coincidencias, habilita el modal para el botón

              // Elimina el evento onclick actual y agrega el evento para abrir el modal

              // Además, elimina el evento onclick actual y agrega el evento para guardar
              // $("#searchButton").off("click").on("click", add);
            }

            return false; // Evita la propagación del evento y el formulario de envío
          },
          close: function (event, ui) {
            // Restablecer el estado del botón cuando se cierra el menú desplegable
            if ($("#selected_person_id").val() == null || $("#selected_person_id").val() === "") {
              console.log($("#selected_person_id").val());
              // Si no se seleccionó ninguna opción, volver al estado original del botón
              $("#searchButton").attr("data-bs-toggle");
              // $("#searchButton").off("click").on("click", add);
              $("#searchButton").text("add");
            }
          }
        });

        // Agregar controlador de eventos para el evento change del campo #documentType
        $("#Document_Type").on("change", function () {
          var selectedValue = $(this).val();
          var isValid = documents.some(function (item) {
            return item.value === selectedValue;
          });
          // Si el valor seleccionado es válido, deshabilitar el campo #name_id
          // de lo contrario, habilitarlo nuevamente
          if (isValid) {
            $("#name_id").val().prop('disabled', true);
          } else {
            $("#name_id").val("").prop('disabled', false);
          }
        });


      } else {
        console.error("Error: No se pudo obtener la lista de personas.");
      }
    },
    error: function (error) {
      // Función que se ejecuta si hay un error en la solicitud
      console.error("Error en la solicitud:", error);
    },
  });
}


function deleteById(id) {
   // Mostrar una alerta de confirmación antes de proceder
   if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/customer/" + id,
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  }).done(function (result) {
    alert("Registro eliminado con éxito");
    loadData(); // Asegúrate de que esta función actualiza correctamente los datos en tu vista
  }).fail(function (error) {
    alert("Error al eliminar el registro: " + error.statusText); // Manejo de error
  });
} else {
  // Si el usuario cancela, simplemente retornamos sin hacer nada
  console.log("Operación cancelada por el usuario.");
}
}

function update() {
  // Construir el objeto data

  try {

    var selectedCityId = parseInt($("#selected_city_id").val());
    if (isNaN(selectedCityId) || selectedCityId === null) {
      console.error("ID de ciudad no válido");
      return;
    }
    console.log(data);
    var data = {
      state: true,
      person: {
          id: $("#person_id").val(),
      "firstName": $("#firstName").val(),
      "lastName": $("#lastName").val(),
      "documentType": $("#Document_Type").val(),
      "document": $("#document").val(),
      "email": $("#email").val(),
      "phone": $("#phone").val(),
      "dateOfBirth": $("#dateOfBirth").val(),
      "gender": $("#gender").val(),
      "address": $("#address").val() + ' No ' + $("#numeral").val() + ' - ' + $("#numeral2").val() + ' - ' + $("#description").val(),
      "city": {
        "id": selectedCityId
      },
      "state": true
    }
  };

    console.log(data);

    var id = $("#id").val();
    var jsonData = JSON.stringify(data);

    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/customer/" + id,
      data: jsonData,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).done(function (result) {
      alert("Registro actualizado con éxito");
      loadData();
      clearData();
      loadPerson();

      //actualzar boton
      var btnAgregar = $('button[name="btnAgregar"]');
      btnAgregar.text("Agregar");
      btnAgregar.attr("onclick", "save()");
    });
  } catch (error) {
    alert("Error en actualizar user.");
    console.error("Error en la solicitud:", error);
    //actualzar boton
    loadData();
    clearData();
    var btnAgregar = $('button[name="btnAgregar"]');
    btnAgregar.text("Agregar");
    btnAgregar.attr("onclick", "save()");
  }
}

function findById(id) {

  if (!id || isNaN(id)) {
    console.error("ID inválido o no definido:", id);
    return;  // Salir de la función si el id no es válido
  }

  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/customer/" + id,
    method: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);

      $("#id").val(data.data.id);
      $('#code').val(data.data.code);
      $('#person_id').val(data.data.person.id);
      $('#state').val(data.data.state === true ? 1 : 0);

      // Llenar el formulario dentro del modal
      $("#firstName").val(data.data.person.firstName);
      $("#lastName").val(data.data.person.lastName);
      $("#Document_Type").val(data.data.person.documentType);
      $("#document").val(data.data.person.document);
      $("#selected_city_id").val(data.data.person.city.id);
      $("#city_id").val(data.data.person.city.name);
      $('#email').val(data.data.person.email);
      $('#phone').val(data.data.person.phone);
      $('#dateOfBirth').val(data.data.person.dateOfBirth);
      $('#gender').val(data.data.person.gender);
      $('#address').val(data.data.person.address);

      //Cambiar boton.
      var btnAgregar = $('button[name="btnAgregar"]');
      btnAgregar.text("Actualizar");
      btnAgregar.attr("onclick", "update()");
    },
    error: function (error) {
      // Función que se ejecuta si hay un error en la solicitud
      console.error("Error en la solicitud:", error);
    },
  });
}

function clearData() {
  $("#id").val("");

  $("#email").val("");
  $("#phone").val("");
  $("#dateOfBirth").val("");
  $("#gender").val("");
  $("#address").val("");
  $("#city_id").val("");
  $("#person_id").val("");
  $("document_id").val("");
  $("#name_id").val("");

  $("#state").val("");
}


function save() {
  try {
    var selectedCityId = parseInt($("#selected_city_id").val());
    if (isNaN(selectedCityId) || selectedCityId === null) {
      console.error("ID de ciudad no válido");
      return;
    }

    var personData = {
      "firstName": $("#firstName").val(),
      "lastName": $("#lastName").val(),
      "documentType": $("#Document_Type").val(),
      "document": $("#document").val(),
      "email": $("#email").val(),
      "phone": $("#phone").val(),
      "dateOfBirth": $("#dateOfBirth").val(),
      "gender": $("#gender").val(),
      "address": $("#address").val() + ' No ' + $("#numeral").val() + ' - ' + $("#numeral2").val() + ' - ' + $("#description").val(),
      "city": {
        "id": selectedCityId
      },
      "state": true
    };

    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/person",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(personData),
      success: function (response) {
        var id = response.data.id
        console.log(response.data.id);
        console.log(response.data);


        alert("Registro agregado con éxito" + id);
        clearData();
        loadData();
        savePersonCustomer(id);
      },
      error: function (error) {
        alert(`La persona: ${$("#person_id").val()} ya cuenta con una cuenta de usuario`);
        //console.log($("#person_id").val());
      },
    });
  } catch (error) {
    console.error("Error obteniendo el cliente:", error);
  }


}


function loadCity() {
  console.log("Ejecutando loadCity");
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/city",
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response)
      if (response.status && Array.isArray(response.data)) {
        var cities = response.data.map(function (city) {
          return {
            label: city.name,
            value: city.id // Agrega el ID como valor
          };
        });

        // Inicializar el autocompletado en el campo de entrada de texto
        $("#city_id").autocomplete({
          source: function (request, response) {
            var results = $.ui.autocomplete.filter(cities, request.term);
            if (!results.length) {
              results = [{ label: 'No se encontraron resultados', value: null }];
            }
            response(results);
          },
          select: function (event, ui) {
            // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
            $("#selected_city_id").val(ui.item.value);
            // Actualiza el valor del campo de entrada con el nombre de la persona seleccionada
            $("#city_id").val(ui.item.label);
            console.log("ID de ciudad seleccionada: " + ui.item.value);
            return false; // Evita la propagación del evento y el formulario de envío
          }
        });
      } else {
        console.error("Error: No se pudo obtener la lista de ciudades.");
      }
    },
    error: function (error) {
      // Función que se ejecuta si hay un error en la solicitud
      console.error("Error en la solicitud:", error);
    },
  });
}


function savePersonCustomer(id) {

  try {

    var data = {
      "person": {
        "id": id
      },
      "state": 1
    };

    var jsonData = JSON.stringify(data);
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/customer",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: jsonData,
      success: function (data) {
        alert("Registro agregado con éxito");
        // clearData();
        loadData();
      },
      error: function (error) {
        alert("Error no se pudo realizar el registro.");
        //console.log($("#person_id").val());
      },
    });
  } catch (error) {
    console.error("Error obteniendo el cliente:", error);
  }
}