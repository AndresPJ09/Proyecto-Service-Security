function save() {
    
    try {
      
      var data = {
        "name": $("#name").val(),
        "code": $("#code").val(),
        "state": parseInt($("#estado").val())
      };
  
      var jsonData = JSON.stringify(data);
      $.ajax({
        url: "http://localhost:9000/service-security/v1/api/position",
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
    $("#name").val("");
    $("#code").val("");
    $("#estado").val("");
    var btnAgregar = $('button[name="btnAgregar"]');
        btnAgregar.text("Agregar");
        btnAgregar.attr("onclick", "save()");
  }


  function loadData() {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/position",
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
     // Mostrar una alerta de confirmación antes de proceder
     if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/position/" + id,
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
    try{
      var data = {
        "name": $("#name").val(),
        "code": $("#code").val(),
        "state": parseInt($("#estado").val())
      };
      
      var id = $("#id").val();
      var jsonData = JSON.stringify(data);
      $.ajax({
        url: "http://localhost:9000/service-security/v1/api/position/" + id,
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
      url: "http://localhost:9000/service-security/v1/api/position/" + id,
      method: "GET",
      dataType: "json",
      success: function (response) {
        var data=response.data;
        $("#id").val(data.id);
        $('#name').val(data.name);
        $("#code").val(data.code);
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