function save() {
 
      var data = {
        "code": $("#codigo").val(),
        "name": $("#nombre").val(),
        "state": parseInt($("#state").val())
      };
  

    var jsonData = JSON.stringify(data);
    Swal.showLoading();
    $.ajax({
        url: "http://localhost:9000/service-security/v1/api/country",
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


  function clearData() {
    $("#id").val("");
    $("#codigo").val("");
    $("#nombre").val("");
    $("#state").val("");
    var btnAgregar = $('button[name="btnAgregar"]');
        btnAgregar.text("Agregar");
        btnAgregar.attr("onclick", "save()");
  }


  function loadData() {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/country",
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
                    <td>${item.name}</td>
                    <td>` + item.code + `</td>
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
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "http://localhost:9000/service-security/v1/api/country/" + id,
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                }
            }).done(function (result) {
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'El registro ha sido eliminado.',
                    icon: 'success',
                    timer: 1500, // Tiempo antes de cerrar automáticamente
                    showConfirmButton: false, // No mostrar botón de confirmación
                });
                loadData(); // Asegúrate de que esta función actualiza correctamente los datos en tu vista
            }).fail(function (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'No se pudo eliminar el registro: ' + error.statusText,
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false,
                });
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: 'Cancelado',
                text: 'La operación de eliminación ha sido cancelada',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    });
}



function update() {
  try {
      var data = {
          "code": $("#codigo").val(),
          "name": $("#nombre").val(),
          "state": parseInt($("#state").val())
      };
      
      var id = $("#id").val();
      var jsonData = JSON.stringify(data);

      $.ajax({
          url: "http://localhost:9000/service-security/v1/api/country/" + id,
          data: jsonData,
          method: "PUT",
          contentType: "application/json",
          success: function (result) {
              Swal.fire({
                  title: 'Actualizado!',
                  text: 'Registro actualizado con éxito',
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false
              });
              loadData();
              clearData();

              // Actualizar botón
              var btnAgregar = $('button[name="btnAgregar"]');
              btnAgregar.text("Agregar");
              btnAgregar.attr("onclick", "save()");
          },
          error: function (error) {
              Swal.fire({
                  title: 'Error!',
                  text: 'No se pudo actualizar el registro',
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false
              });
              console.error("Error en la solicitud:", error);
              loadData();
              clearData();
              var btnAgregar = $('button[name="btnAgregar"]');
              btnAgregar.text("Agregar");
              btnAgregar.attr("onclick", "save()");
          }
      });
  } catch (error) {
      Swal.fire({
          title: 'Error!',
          text: 'Error en actualizar country.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
      });
      console.error("Error en la solicitud:", error);
      loadData();
      clearData();
      var btnAgregar = $('button[name="btnAgregar"]');
      btnAgregar.text("Agregar");
      btnAgregar.attr("onclick", "save()");
  }
}


  function findById(id) {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/country/" + id,
      method: "GET",
      dataType: "json",
      success: function (response) {
        var data=response.data;
        $("#id").val(data.id);
        $("#codigo").val(data.code);
        $('#nombre').val(data.name);
        $("#state").val(data.state == true ? 1 : 0);
  
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