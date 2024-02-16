

// Supongamos que tienes un botón en tu interfaz con el id "descargar"



function PasoUno () {

  mostrarCargando()

  const empresa = document.getElementById("empresa").value;

  const objeto = {
    empresa: empresa
  };
  
fetch("/crearArchivo", {
  method:"POST",
  headers: { 
     "Content-type": "application/json",
  },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   { 
  console.log(json)



  setTimeout(Pasodos, 2000);




 })}




function Pasodos () {


  // Realizar una solicitud al endpoint del servidor utilizando el método POST
  fetch('/dwticket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }
      return response.blob();
    })
    .then((blob) => {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Datos.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error:', error);
      // Manejo de errores, si es necesario
    });
};









 
   fetch("/solicitudemp", {
	
      method:"POST",
      headers: {"Content-type":"application/json"},
        })
         .then(res => res.json())
         .then(json =>  { 

          let DatosEmpresa = ordenarPorEmpresa(json)

          function ordenarPorEmpresa(data) {
            return data.sort((a, b) => {
                if (a.empresa.toLowerCase() < b.empresa.toLowerCase()) return -1;
                if (a.empresa.toLowerCase() > b.empresa.toLowerCase()) return 1;
                return 0;
            });
        }

          Listempresas(DatosEmpresa)
})


function Listempresas(json) {


                 
           for(i=0; i< json.length; i++ ){
            
              
              const empresa = document.getElementById("empresa")
              const empresae = document.createElement("option")
              empresae.setAttribute(`id` , `tik${i}` )
              empresae.setAttribute(`class` , `deleTotalEmp` )
              empresae.textContent = json[i].empresa.toUpperCase();
              empresa.appendChild(empresae)

            
          
           
             } }


             function Reportar() {



              var reporteElement = document.getElementById("reporteid");
              reporteElement.style.display = "inline";
             
              
              }


       function SalirRep() {
        var textarea = document.getElementById("textoReporte");
        var reporteElement = document.getElementById("reporteid");
        reporteElement.style.display = "none";
        textarea.value = "";


              }





        function ENVIARrepo (){ 
          
          var reporteElement = document.getElementById("reporteid");
          reporteElement.style.display = "none";



          var contenido = document.getElementById("textoReporte").value;

          
console.log(contenido)

              mail =   { "contenido" : contenido,
                 }

           
 
 fetch("/resivireporte", {
    method:"POST",
    headers: { 
       "Content-type": "application/json",
    },
 body: JSON.stringify( mail )})
 .then(res => res.json())
 .then(json =>   {  
 if( json == "true" ){
 
   }
  
 
    }   )}


    borrado = false;
    var textarea = document.getElementById("textoReporte");

// Agrega un evento de clic al textarea
textarea.addEventListener("click", function() {

  if(borrado == false ){
  // Cuando el usuario hace clic, borra el contenido predeterminado
  textarea.value = "";
borrado = true;}
});


function mostrarCargando() {
  var cargandoDiv = document.getElementById("cargando");
  
  // Mostrar el div de carga
  cargandoDiv.style.display = "block";
  
  // Ocultar el div después de 2 segundos
  setTimeout(function() {
    cargandoDiv.style.display = "none";
  }, 2000); // 2000 milisegundos (2 segundos)
}
