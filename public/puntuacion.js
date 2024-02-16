
const clave1Value = document.getElementById("clave1").value;
const clave2Value = document.getElementById("clave2").value;
const clave3Value = document.getElementById("clave3").value;




function puntuar() {


  function ticket (){
    const urlActual = window.location.href;
    const indiceStock = urlActual.indexOf("puntuacion/");
  
    if (indiceStock !== -1) {
      const parteDespuesDeStock = urlActual.substring(indiceStock + 11);
      console.log(`${parteDespuesDeStock}`);
      return parteDespuesDeStock;
    } else {
      return null; // "stock/" no se encontró en la URL
    }}


  
let variable = ["star10" , "star9" ,"star8" ,"star7" ,"star6" ,"star5" ,"star4" ,"star3" ,"star2" ,"star1" , ];

 puntuacion = 0;

function getPuntuacion() {
  for (let i = 0; i < variable.length; i++) {
      let inputElement = document.getElementById(variable[i]);
      if (inputElement.checked) {
          return parseInt(variable[i].replace('star', ''));
      }
  }
  return 0; // Valor predeterminado si ninguno está marcado
}


 
      if (getPuntuacion() == "0") {

alert("Debe seleccionar un nivel de complejidad")

      } else {  puntuacion = getPuntuacion() }



      function obtenerTiempoSeleccionado() {
        const hourInput = document.getElementById('hour');
        const minutesInput = document.getElementById('minutes');
        const resultParagraph = document.getElementById('result');

        const hour = hourInput.value;
        const minutes = minutesInput.value;

        if (hour && minutes) {
            const formattedTime = `${hour}:${minutes}`;
            return formattedTime
        } else {
            return false
        }

       }
    


       objeto = {
        ticket : ticket(),
        puntuacion : getPuntuacion(),
        tiempo: obtenerTiempoSeleccionado(),
        clave1Value : document.getElementById("clave1").value,
        clave2Value : document.getElementById("clave2").value,
        clave3Value : document.getElementById("clave3").value,
       }

       if ( objeto.puntuacion == 0 || objeto.tiempo == false || objeto.clave1Value == "" || objeto.clave2Value == "" ||  objeto.clave3Value == ""  ) {

          alert ("Algunos de los valores no se rellenaron correctamente")


       } else {


        
fetch("/puntuacionfinal", {
  method:"POST",
  headers: { 
     "Content-type": "application/json",
  },
 body: JSON.stringify( objeto )})
 .then(res => res.json())
 .then(json =>   {  
 
  if (json == true) {   window.close();  }
 
 
  }   )
 



       }






  }




   function verificar() {

    const clave1Value = document.getElementById("clave1").value;
    const clave2Value = document.getElementById("clave2").value;
    const clave3Value = document.getElementById("clave3").value;      
    console.log("ejecutando")
  

    if (clave1Value.includes(" ") || clave2Value.includes(" ") || clave3Value.includes(" ")) {
      alert("No se permiten espacios en las claves.");
      document.getElementById("clave1").value = "";
      document.getElementById("clave2").value = "";
      document.getElementById("clave3").value = "";
    }
  }


  setInterval(verificar, 1000);