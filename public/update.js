function ok() {
    // Obtener la imagen seleccionada
    var image = document.getElementById("imgbk").files[0];
  
    // Crear un objeto FormData para enviar la imagen al servidor
    var formData = new FormData();
    formData.append("image-file", image);
  
    // Enviar la imagen al servidor
    fetch("/uploadimg", {
      method: "POST",
      body: formData
    })
    .then(response => {
      if(response.ok){
        alert("Imagen enviada con éxito");
      }else{
        throw new Error("Error al enviar imagen");
      }
    })
    .catch(error => {
      console.log(error);
    });
  }