function save() {
  var selectedEmployId = parseInt($("#selected_employ_id").val());
  if (isNaN(selectedEmployId) || selectedEmployId === null) {
    console.error("ID de empleado no válido");
    return;
  }

  console.log(selectedCompanyId);

  var selectedCompanyId = parseInt($("#selected_company_id").val());
  if (isNaN(selectedCompanyId) || selectedCompanyId === null) {
    console.error("ID de ciudad no válido");
    return;
  }

  try {
    
    var data = {
      "code": $("#code").val(),
      "employed": {
        "id": selectedEmployId,
        "name": $("#employed_id").val()
      },
      "company": {
        "id": selectedCompanyId
      },
      "salary": $("#salary").val(),
      "startDate": $("#start_date").val(),
      "endDate": $("#end_date").val(),
      "objecto": $("#objecto").val(),
      "state": parseInt($("#estado").val())
    };
    console.log(save);
    var jsonData = JSON.stringify(data);
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/contract",
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
  $("#id").val("");
  $("#code").val("");
  $("#employed_id").val("");
  $("#company_id").val("");
  $("#salary").val("");
  $("#start_date").val("");
  $("#end_date").val("");
  $("#objecto").val("");
  $("#estado").val("");
  var btnAgregar = $('button[name="btnAgregar"]');
      btnAgregar.text("Agregar");
      btnAgregar.attr("onclick", "save()");
}


function loadData() {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/contract",
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response.data);
      var html = "";
      var data = response.data;
      data.forEach(function (item) {
        // Construir el HTML para cada objecto
        if (!item.deletedAt) {
        html +=
          `<tr>
                  <td>${item.code}</td>
                  <td>` + item.salary + `</td>
                  <td>` + item.employed.person.firstName + `</td>
                  <td>` + item.company.rs + `</td>
                  <td>` + item.startDate + `</td>
                  <td>` + item.endDate + `</td>
                  <td>` + item.objecto + `</td>
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


function deleteById(id) {
   // Mostrar una alerta de confirmación antes de proceder
   if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/contract/" + id,
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
    var selectedEmployId = parseInt($("#selected_employ_id").val());
    if (isNaN(selectedEmployId) || selectedEmployId === null) {
      console.error("ID de empleado no válido");
      return;
    }
  
    console.log(selectedEmployId);
  
    var selectedCompanyId = parseInt($("#selected_company_id").val());
    if (isNaN(selectedCompanyId) || selectedCompanyId === null) {
      console.error("ID de ciudad no válido");
      return;
    }
  // Construir el objecto data
  try{
    var data = {
      "code": $("#code").val(),
      "startDate": $("#start_date").val(),
      "endDate": $("#end_date").val(),
      "salary": $("#salary").val(),
      "objecto": $("#objecto").val(),
      "employed": {
          "id": selectedEmployId
        },
        "company": {
          "id": selectedCompanyId
        },
      "state": parseInt($("#estado").val())
    };
    
    var id = $("#id").val();
    var jsonData = JSON.stringify(data);
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/contract/" + id,
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

function findById(id) {
  $.ajax({
    url: "http://localhost:9000/service-security/v1/api/contract/" + id,
    method: "GET",
    dataType: "json",
    success: function (response) {
      var data=response.data;
      $("#id").val(data.id);
      $("#code").val(data.code);
      $('#start_date').val(data.startDate);
      $('#end_data').val(data.endDate);
      $('#salary').val(data.salary);
      $('#objecto').val(data.objecto);
      $("#selected_employ_id").val(data.employed.id);
      $("#employed_id").val(data.employed.firstName+" "+data.employed.lastName);
      $("#selected_company_id").val(data.company.id);
      $("#company_id").val(data.company.firstName+" "+data.company.lastName);
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


function loadEmploy() {
  $.ajax({
      url: "http://localhost:9000/service-security/v1/api/employed",
      method: "GET",
      dataType: "json",
      success: function(response) {
          if (response.status && Array.isArray(response.data)) {
              var employees = response.data.map(function(employed) {
                  return {
                      label: employed.person.firstName,
                      value: employed.id
                  };
              });

              // Inicializar el autocompletado en el campo de entrada de texto
              $("#employed_id").autocomplete({
                  source: employees,
                  select: function(event, ui) {
                      // Al seleccionar un elemento del autocompletado, guarda el ID en un campo oculto
                      $("#selected_employ_id").val(ui.item.value);
                      // Actualiza el valor del campo de entrada con el ID del employed seleccionado
                      $("#employed_id").val(ui.item.label);
                      console.log("ID de employed seleccionado: " + ui.item.value);
                      return false; // Evita la propagación del evento y el formulario de envío
                  }
              });
          } else {
              console.error("Error: No se pudo obtener la lista de empleados.");
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

