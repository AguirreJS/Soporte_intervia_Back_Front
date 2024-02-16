

let Empresas = [];

 
   fetch("/solicitudemp", {
	
      method:"POST",
      headers: {"Content-type":"application/json"},
        })
         .then(res => res.json())
         .then(json =>  { 

            Empresas = json;
            insertarEmpresas(json);
})



document.addEventListener("DOMContentLoaded", function() {
  // Esta función se encargará de verificar el input
  function checkInput() {
      const input = document.getElementById('asunto');
      const alert1 = document.getElementById('alert1');
      const alert2 = document.getElementById('alert2');

      if (input.value.length === 0) {
          alert1.style.display = 'inline';
          alert2.style.display = 'inline';
      } else if (input.value.length > 5) {
          alert1.style.display = 'none';
          alert2.style.display = 'none';
      }
  }

  // La función se ejecuta cada 2 segundos
  setInterval(checkInput, 2000);
});





setTimeout(function() {
   Listempresas(Empresas);
 }, 500);


document.addEventListener("DOMContentLoaded", function() {
   var input = document.getElementById("buscador");
   input.addEventListener("input", miFuncion);
 
   function miFuncion() {

    console.log(Empresas)

      let buscador = document.getElementById("buscador").value; 
   
      if (buscador.value == "") { console.log("Vacio") } else {

         let parametroEnviar=[];
         let z=0


         function BuscarPropiedad() {
if(input.value == "") {  console.log("erro") }

            return new Promise((resolve, reject) => {
               for(i=0; i< Empresas.length; i++ ){
                  const indice = Empresas[i].empresa.toLowerCase().indexOf(input.value);
                  if (indice !== -1 ) { 
                     
                     parametroEnviar[z]= Empresas[i];
                     z++
                  
                  } 
               
               
              }
          
              resolve(parametroEnviar);
            });
          }
          
      
      
          BuscarPropiedad().then(() => {
          
            Listempresas(parametroEnviar); 
          
          });}}
 });

          








function Listempresas(json) {

   removerEmpresas()
                  
            for(i=0; i< json.length; i++ ){
             
               
               const empresa = document.getElementById("empresa")
               const empresae = document.createElement("option")
               empresae.setAttribute(`id` , `tik${i}` )
               empresae.setAttribute(`class` , `deleTotalEmp` )
               empresae.textContent = json[i].empresa.toUpperCase();
               empresa.appendChild(empresae)

             
           
            
              }

              historial();
               
}


function removerEmpresas() {
   let elementos = document.querySelectorAll('.deleTotalEmp');
   elementos.forEach(function(elemento) {
       elemento.remove();
   });

}


function removerUsers() {
   let elementos = document.querySelectorAll('.deleTotalUser');
   elementos.forEach(function(elemento) {
       elemento.remove();
   });

}

//////////////////////////////////////////////////////////
const select = document.getElementById("empresa");
select.addEventListener("change", function() { historial() })



document.addEventListener("DOMContentLoaded", function() {
   var input = document.getElementById("buscadorUser");
   input.addEventListener("input", miFuncion);
 
   function miFuncion() {

   
      let buscador = document.getElementById("buscadorUser").value; 
   
      if (buscador.value == "") { console.log("Vacio") } else {

         let parametroEnviar=[];
         let z=0


         function BuscarPropiedad() {
if(input.value == "") {  console.log("erro") }

            return new Promise((resolve, reject) => {
               for(i=0; i< BusArrayd.length; i++ ){
                  const indice = BusArrayd[i].empresa.toLowerCase().indexOf(input.value);
                  const indice2 = BusArrayd[i].nombre.toLowerCase().indexOf(input.value);
                  const indice3 = BusArrayd[i].apellido.toLowerCase().indexOf(input.value);
                  const indice4 = BusArrayd[i].correo.toLowerCase().indexOf(input.value);
                  if (indice !== -1 ||indice2  !== -1 ||indice3  !== -1 ||indice4  !== -1 ) { 
                     
                     parametroEnviar[z]= BusArrayd[i];
                     z++
                  
                  } 
               
               
              }
          
              resolve(parametroEnviar);
            });
          }
          
      
      
          BuscarPropiedad().then(() => {
          
            historial2(parametroEnviar); 
          
          });}}
 });

let BusArrayd;


fetch("/buscadordeusuarios", {
   method: "POST",
   headers: {"Content-type": "application/json"},
 })
 .then(res => res.json())
 .then(json => {
   const transformToLower = (obj) => {
     for (let prop in obj) {
       if (typeof obj[prop] === 'string') {
         obj[prop] = obj[prop].toLowerCase();
       } else if (typeof obj[prop] === 'object') {
         transformToLower(obj[prop]);
       }
     }
   }
 

   transformToLower(json);
 
 BusArrayd = json

})
 .catch(error => console.error(error));







function historial() { 

   removerUsers()

   let Empresa1 =  document.getElementById('empresa').value;



            for(i=0; i< BusArrayd.length; i++ ){

              
               if( Empresa1.toUpperCase() == BusArrayd[i].empresa.toUpperCase() ){
                const empresa = document.getElementById("user")
               const empresae = document.createElement("option")
               empresae.setAttribute(`id` , `tik${i}` )
               empresae.setAttribute(`class` , `deleTotalUser` )
               empresae.textContent = BusArrayd[i].correo;
               empresa.appendChild(empresae)}

            }



          
          }


          
function historial2(info) { 



   removerUsers()

 
   for(i=0; i< info.length; i++ ){
                const empresa = document.getElementById("user")
               const empresae = document.createElement("option")
               empresae.setAttribute(`id` , `tik${i}` )
               empresae.setAttribute(`class` , `deleTotalUser` )
               empresae.textContent = info[i].correo;
               empresa.appendChild(empresae) }

            }



          
          
        
     
  




  function generar() { 

   const notaconcoma = document.getElementById("nota").value;


   const valorSinComas = notaconcoma.replace(/,/g, '');

   const input = document.getElementById("imagen");
   if (input.files.length > 0) { 


    const fecha = new Date();
    let dia = fecha.getDate();
    let mes1 = fecha.getMonth();
    let mes = mes1 + 1 ;
    let año = fecha.getFullYear();
   
 
    var fecha1 = dia +'/'+ mes +'/'+ año;

    let correo = document.getElementById("user").value; 
    console.log(correo)
    let objeto = {  "correo" : correo   }

    fetch("/listausun11", {
        method:"POST",
        headers: { 
           "Content-type": "application/json",
        },
        body:JSON.stringify(objeto),
     })
	.then(res => res.json())
	.then(data => { 


      const input = document.getElementById("imagen");

  if (input.files.length > 0) { 
    const file = input.files[0];
    if (file.size/1000000 > 15) {
      alert("El archivo es demasiado grande, selecciona un archivo menor a 15MB.");
    } else {

const input = document.getElementById("imagen");
const file = input.files[0];
const reader = new FileReader();
reader.readAsDataURL(file);                    
    
    reader.onload = function() {  
                  

                          const tiketfinal = {
                                "nombre": data[0].nombre,
                                "apellido": data[0].apellido,
                              "correo": data[0].correo,
                             "empresa": data[0].empresa,
                            "asunto": document.getElementById("asunto").value,
                             "descrip": document.getElementById("descrip").value,
                             "nota":valorSinComas,
                             "anydesk":"Sin Anydesk",
                            "estado" : "En Proceso",
                          "fecha" : fecha1,
                        "imagen": reader.result }  

console.log(tiketfinal)

                                      fetch("/sendtiketimgadmin", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                                window.location.href = "usermanual"; 
                                                                       }) }}}})}
                                                                     
                                                                     
                                                                     else {


                                                                         


    const fecha = new Date();
    let dia = fecha.getDate();
    let mes1 = fecha.getMonth();
    let mes = mes1 + 1 ;
    let año = fecha.getFullYear();
   
 
    var fecha1 = dia +'/'+ mes +'/'+ año;

    let correo = document.getElementById("user").value; 
    console.log(correo)
    let objeto = {  "correo" : correo   }

    fetch("/listausun11", {
        method:"POST",
        headers: { 
           "Content-type": "application/json",
        },
        body:JSON.stringify(objeto),
     })
	.then(res => res.json())
	.then(data => {
                   console.log("proceso finalizado")
                   console.log(data)
                   console.log(data[0].nombre)
                          const tiketfinal = {
                                "nombre": data[0].nombre,
                                "apellido": data[0].apellido,
                              "correo": data[0].correo,
                             "empresa": data[0].empresa,
                            "asunto": document.getElementById("asunto").value,
                             "descrip": document.getElementById("descrip").value,
                             "nota":valorSinComas,
                             "anydesk":"Sin Anydesk",
                            "estado" : "En Proceso",
                          "fecha" : fecha1 }  



                                      fetch("/sendtiketadmin", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                                window.location.href = "usermanual"; 
                                                                       }) })




                                                                     }
                                                                  
                                                                  
                                                                  
                                                                  
                                                                  }






///////////////////////Cargar nuevo usuario

   

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


  let emp = document.getElementById("correoNew").value;
   const lastIndex = emp.lastIndexOf('@');
   return emp.slice(lastIndex + 1, emp.length);

}

return empresaDominio();

  } else {
      return selectedValue;
  }
}












function  envioLogin() {
  if (confirm("¿Estás seguro de que deseas crear un nuevo usuario con estos datos?")) {
     envioLoginok()
   } else {
     console.log("cancelado")
   } 
  
  }


  


  function envioLoginok() {

    function validarCampos() {
      let nombre = document.getElementById("nombreNew").value; 
      let apellido = document.getElementById("apellidoNew").value;
      let correo = document.getElementById("correoNew").value; 
    
      if(nombre.trim() === '' || apellido.trim() === '' || correo.trim() === '') {
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
   
      let nombre = document.getElementById("nombreNew").value; 
      let apellido = document.getElementById("apellidoNew").value;
      let correo = document.getElementById("correoNew").value; 
   
   

     
  

   let backend = {
         
         "nombre": nombre,
         "apellido":apellido,
           "correo":correo,
         "pass" : "65as4d4d4as1",
        "empresa":empresa(),
         "nacimiento":"01/01/2022",
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
.then(json =>  {console.log(json);     if (json == true) { window.location.href = "usermanual"; } else if (json == false) { alert("Parece que el usuario ya existe") }




 })



} else { 
 alert("Almenos uno de los campos no fue completado correctamente")} }



                                                               
