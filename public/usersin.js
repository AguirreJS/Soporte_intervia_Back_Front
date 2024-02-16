


// Función para insertar las empresas en el select
function insertarEmpresas(empresas) {
  // Seleccionar el elemento select
  let selectElem = document.getElementById('selectionEmpresa');
  
  // Añadir cada empresa como una opción
 empresas.forEach(emp => {
        let option = document.createElement('option');
        option.value = emp.empresa;
        option.innerText = emp.empresa;
        option.id = emp.dominio; // Establece el id basado en el dominio
        selectElem.appendChild(option);
    });
}

// Función que devuelve el valor seleccionado o 'seleccion' si la opción es "Seleccion Automatica por dominio"
function empresa() {

  var selectElement = document.getElementById("selectionEmpresa");
  var selectedOptionId = selectElement.options[selectElement.selectedIndex].id;
  
  
  var optionId = selectedOptionId;

  selectedValue = optionId;
  
  if (selectedValue == "Active") {
      
function empresaDominio() {


  let emp = document.getElementById("correo").value;
   const lastIndex = emp.lastIndexOf('@');
   return emp.slice(lastIndex + 1, emp.length);

}

return empresaDominio();

  } else {
      return selectedValue;
  }
}

// Hacer el fetch para obtener las empresas y luego insertarlas en el select
fetch("/solicitudemp", {
  method:"POST",
  headers: {"Content-type":"application/json"},
})
.then(res => res.json())
.then(json =>  {
  console.log(json);
  insertarEmpresas(json);
})










function  envioLogin() {
  if (confirm("¿Estás seguro de que deseas crear un nuevo usuario con estos datos?")) {
     envioLoginok()
   } else {
     console.log("cancelado")
   } 
  
  }


  


  function envioLoginok() {

    function validarCampos() {
      let nombre = document.getElementById("nombre").value; 
      let apellido = document.getElementById("apellido").value;
      let correo = document.getElementById("correo").value; 
      let nacimiento = document.getElementById("nacimiento").value; 
    
      if(nombre.trim() === '' || apellido.trim() === '' || correo.trim() === '' || nacimiento.trim() === '') {
        return false; // al menos uno de los campos está vacío
      }
    
      // expresión regular para validar el correo electrónico
      let expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!expresion.test(correo)) {
        return false; // el correo electrónico no es válido
      }
    
      return true; // todos los campos tienen valor y el correo electrónico es válido
    }

if (validarCampos() == true ) { 
   
     let nombre = document.getElementById("nombre").value; 
     let apellido = document.getElementById("apellido").value;
     let correo = document.getElementById("correo").value; 
     let nacimiento = document.getElementById("nacimiento").value; 
   

     
  

   let backend = {
         
         "nombre": nombre,
         "apellido":apellido,
           "correo":correo,
         "pass" : "65as4d4d4as1",
        "empresa":empresa(),
         "nacimiento":nacimiento,
        "anydesk":"Sin Anydesk Asignado",
        "telefono":"Sin Telefono Asignado",
        "valid2" : 1,
        "valid3" : 0,
        "valid4" : 0,
        "valid5" : 0,
   
           }

           console.log(backend);
           console.log(JSON.stringify(backend));


fetch("/logeoman", {
  method:"POST",
  headers: { 
     "Content-type": "application/json",
  },
  body:JSON.stringify(backend),
})
.then(res => res.json())
.then(json =>  {console.log(json);     if (json == true) { window.location.href = "usersin"; } else if (json == false) { document.getElementById("Error").innerHTML=`El usuario ya Existe se le envio una clave a su correo para reestablecer la contraseña enviale este <a  href="codigov.html" style="color: withe";>ENLACE</a> para que reestablesca la contraseña o usted mismo como administrador puede reestablecer la contraseña de este usuario <a  href="/pssmod" style="color: withe";>AQUI</a>`  }




 })



} else { 
  let error = document.getElementById("errorjs");
error.style.display = "inline";} }



