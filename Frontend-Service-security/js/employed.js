function save() {
    // Las correcciones y ajustes se aplicarán aquí
    var selectedPersonId = parseInt($("#selected_person_id").val());
    if (isNaN(selectedPersonId) || selectedPersonId === null) {
      console.error("ID de persona no válido");
      return;
    }

    console.log(selectedCompanyId);

    var selectedCompanyId = parseInt($("#selected_company_id").val());
    if (isNaN(selectedCompanyId) || selectedCompanyId === null) {
      console.error("ID de empresa no válido");
      return;
    }

    console.log(selectedPositionId);

    var selectedPositionId = parseInt($("#selected_position_id").val());
    if (isNaN(selectedPositionId) || selectedPositionId === null) {
      console.error("ID de cargo no válido");
      return;
    }

    try {
      var data = {
        "salary": $("#salary").val(),
        "person": {
            "id": selectedPersonId
        },
        "company": {
            "id": selectedCompanyId
        },
        "position": {
            "id": selectedPositionId
        },
        "state": parseInt($("#estado").val())
      };

      var jsonData = JSON.stringify(data);
      $.ajax({
        url: "http://localhost:9000/service-security/v1/api/employed",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: jsonData,
        success: function(data) {
          alert("Registro agregado con éxito");
          clearData();
          loadData();
        },
        error: function(error) {
          alert(`Error no se pudo realizar el registro.`);
          //console.log($("#person_id").val());
        },
      });
    } catch (error) {
      console.error("Error obteniendo el cliente:", error);
    }
  }

function clearData() {
    $("#salary").val('');
    $("#person_id").val('');
    $("#company_id").val('');
    $("#position_id").val('');
    $("#estado").val('');
    var btnAgregar = $('button[name="btnAgregar"]');
        btnAgregar.text("Agregar");
        btnAgregar.attr("onclick", "save()");
  }


  function loadData() {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/employed",
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
                    <td>${item.salary}</td>
                    <td>` + item.person.firstName + `</td>
                    <td>` + item.company.rs + `</td>
                    <td>` + item.position.name + `</td>
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

  function update() {
    var selectedPersonId = parseInt($("#selected_person_id").val());
    if (isNaN(selectedPersonId) || selectedPersonId === null) {
      console.error("ID de persona no válido");
      return;
    }

    var selectedCompanyId = parseInt($("#selected_company_id").val());
    if (isNaN(selectedCompanyId) || selectedCompanyId === null) {
      console.error("ID de empresa no válido");
      return;
    }

    var selectedPositionId = parseInt($("#selected_position_id").val());
    if (isNaN(selectedPositionId) || selectedPositionId === null) {
      console.error("ID de cargo no válido");
      return;
    }
    // Construir el objeto data
    try{
        var data = {
            "salary": $("#salary").val(),
            "person": {
                "id": selectedPersonId
            },
            "company": {
                "id": selectedCompanyId
            },
            "position": {
                "id": selectedPositionId
            },
            "state": parseInt($("#estado").val())
          };
      
      var id = $("#id").val();
      var jsonData = JSON.stringify(data);
      $.ajax({
        url: "http://localhost:9000/service-security/v1/api/employed/" + id,
        data: jsonData,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }).done(function (result) {
        alert("Registro actualizado con éxito");
        loadData();
        clearData();
    
        //actualzar boton
        var btnAgregar = $('button[name="btnAgregar"]');
        btnAgregar.text("Agregar");
        btnAgregar.attr("onclick", "save()");
      });
    }catch (error) {
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

  function deleteById(id) {
     // Mostrar una alerta de confirmación antes de proceder
     if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/employed/" + id,
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

  function findById(id) {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/employed/" + id,
      method: "GET",
      dataType: "json",
      success: function (response) {
        var data=response.data;
        $("#id").val(data.id);
        $("#salary").val(data.salary);
        $("#selected_person_id").val(data.person.id);
        $("#person_id").val(data.person.firstName+" "+data.person.lastName);
        $("#selected_company_id").val(data.company.id);
        $("#company_id").val(data.company.firstName+" "+data.company.lastName);
        $("#selected_position_id").val(data.position.id);
        $("#position_id").val(data.position.firstName+" "+data.position.lastName);
        $("#estado").val(data.state == true ? 1 : 0);
  
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


  function loadPerson() {
    $.ajax({
        url: "http://localhost:9000/service-security/v1/api/person",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status && Array.isArray(response.data)) {
                var personies = response.data.map(function(person) {
                    return {
                        label: person.firstName, // Cambiar 'firstName' por el nombre adecuado de la empresa
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
  
  
  function loadCompany() {
    $.ajax({
        url: "http://localhost:9000/service-security/v1/api/company",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status && Array.isArray(response.data)) {
                var companies = response.data.map(function(company) {
                    return {
                        label: company.rs, // Cambiar 'rs' por el nombre adecuado de la empresa
                        value: company.id
                    };
                });
  
                // Inicializar el autocompletado en el campo de entrada de texto
                console.log(companies)
                $("#company_id").autocomplete({
                    source: companies,
                    select: function(event, ui) {
                        // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
                        $("#selected_company_id").val(ui.item.value);
                        // Actualiza el valor del campo de entrada con el nombre de la empresa seleccionada
                        $("#company_id").val(ui.item.label);
                        console.log("ID de empresa seleccionada: " + ui.item.value);
                        return false; // Evita la propagación del evento y el formulario de envío
                    }
                });
            } else {
                console.error("Error: No se pudo obtener la lista de empresas.");
            }
        },
        error: function(error) {
            // Función que se ejecuta si hay un error en la solicitud
            console.error("Error en la solicitud:", error);
        }
    });
  }
  
  function loadPosition() {
    console.log("Ejecutando loadPosition");
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/position",
      method: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status && Array.isArray(response.data)) {
          var posities = response.data.map(function (position) {
            return {
              label: position.name,
              value: position.id // Agrega el ID como valor
            };
          });
  
          // Inicializar el autocompletado en el campo de entrada de texto
          $("#position_id").autocomplete({
            source: function(request, response) {
              var results = $.ui.autocomplete.filter(posities, request.term);
              if (!results.length) {
                results = [{ label: 'No se encontraron resultados', value: null }];
              }
              response(results);
            },
            select: function (event, ui) {
              // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
              $("#selected_position_id").val(ui.item.value);
              // Actualiza el valor del campo de entrada con el nombre de la persona seleccionada
              $("#position_id").val(ui.item.label);
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