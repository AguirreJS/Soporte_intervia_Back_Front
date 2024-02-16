


document.getElementById('inpssw2').addEventListener('keydown', function(event) {
   if (event.key === 'Enter') {
      enviosession1();
   }
 });
       
    
     
	
  
let intentos = 0 ;






 document.getElementById("Error").style.display = "none";


function enviosession() {
   document.getElementById("but").style.display = "none";
   document.getElementById("cargando").style.display = "flex";
   document.getElementById("reset").style.display = "none";

   correomin = document.getElementById("incorreo").value;
   function removeQuotes(string) {
      return string.replace(/['"]+/g, '');
  }
   let correo = removeQuotes(correomin).toLowerCase();
   console.log(correo)
   passw = document.getElementById("inpssw").value;
 

   function removeQuotes(string) {
      return string.replace(/['"]+/g, '');
  }
  
 

   fetch('https://api.ipify.org?format=json')
   .then(response => response.json())
   .then(data => {
    
     
     IPG = data.ip;
     
    
     const objeto = {
      'correo' : correo,
      'passw' : passw, 
      'ip':IPG  }


   
   fetch("/inisession", {
   method:"POST",
   headers: { 
      "Content-type": "application/json"},
      body: JSON.stringify(objeto),
   
   })
   .then(res => res.json())
   .then(json =>  { 
         if (json == true) { console.log("true"); function inicio() { window.location.href = "index.html"; } ; inicio() } 
         else if ( json == false) { 
         document.getElementById("Error").style.display = "inline-block";
         document.getElementById("Error").innerHTML=`Contraseña o Correo Electronico Incorrectos`
      intentos++;
   console.log(intentos); if (intentos >= 5 ) { window.location.href = "iniciar.html";} }
         else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error alguno de los campos no fue completado` } 
                               })    })
                              
                              
                   setTimeout( ()=> {document.getElementById("reset").style.display = "inline-block" ;document.getElementById("but").style.display = "inline-block"; document.getElementById("cargando").style.display = "none"; }, 2000)       
                  
                  
                 
                 
                 
                  }

/////////////////

function enviosessionTelefonos() {
   document.getElementById("but").style.display = "none";
   document.getElementById("cargando").style.display = "flex";
   document.getElementById("reset").style.display = "none";

   correomin = document.getElementById("incorreo1").value;
   function removeQuotes(string) {
      return string.replace(/['"]+/g, '');
  }
   let correo = removeQuotes(correomin).toLowerCase();
   console.log(correo)
   passw = document.getElementById("inpssw1").value;
 

   function removeQuotes(string) {
      return string.replace(/['"]+/g, '');
  }
  
 

   fetch('https://api.ipify.org?format=json')
   .then(response => response.json())
   .then(data => {
    
     
     IPG = data.ip;
     
    
     const objeto = {
      'correo' : correo,
      'passw' : passw, 
      'ip':IPG  }


   
   fetch("/inisession", {
   method:"POST",
   headers: { 
      "Content-type": "application/json"},
      body: JSON.stringify(objeto),
   
   })
   .then(res => res.json())
   .then(json =>  { 
         if (json == true) { console.log("true"); function inicio() { window.location.href = "index.html"; } ; inicio() } 
         else if ( json == false) { 
         document.getElementById("Incorrectos").style.display = "inline-block";
      intentos++;
   console.log(intentos); if (intentos >= 5 ) { window.location.href = "iniciar.html";} }
         else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error alguno de los campos no fue completado` } 
                               })    })
                              
                              
                   setTimeout( ()=> {document.getElementById("reset").style.display = "inline-block" ;document.getElementById("but").style.display = "inline-block"; document.getElementById("cargando").style.display = "none"; }, 2000)       
                  
                  
                 
                 
                 
                  }




/// SI EL USUARIO DESEA REESTABLECER SU CONTRASEÑA


function resetTelefonos() {
    
                   
   let correo = document.getElementById("incorreo1").value; 
 


 let backend = {
      
      "nombre": "nombre",
      "apellido":"apellido",
       "correo":correo
  
 
      }

      console.log(backend);
      console.log(JSON.stringify(backend));


fetch("/olvilogin", {
method:"POST",
headers: { 
   "Content-type": "application/json",
},
body:JSON.stringify(backend),
})
.then(res => res.json())
.then(json =>  {console.log(json);    
 if (json == false) { 
   console.log(json) ; document.getElementById("IncorrectosUser").style.display = "inline-block";} 
   else if (json == true) { window.location.href = "codigov.html";  }




})



}



                   function reset() {
                     let correo = document.getElementById("incorreo2").value; 

                     if ( correo == "" ) {let correoUsuario = prompt("Ingrese su correo")
                   
                    
                   
                  
               
                   let backend = {
                        
                        "nombre": "nombre",
                        "apellido":"apellido",
                         "correo": correoUsuario
                    
                   
                        }
               
                        console.log(backend);
                        console.log(JSON.stringify(backend));
                
               
                fetch("/olvilogin", {
                  method:"POST",
                  headers: { 
                     "Content-type": "application/json",
                  },
                  body:JSON.stringify(backend),
               })
               .then(res => res.json())
               .then(json =>  {console.log(json);    
                   if (json == false) { 
                     console.log(json) ; alert("El usuario que esta tratando de reestablecer la contraseña no existe en nuestra base de datos")} 
                     else if (json == true) { window.location.href = "codigov.html";  }
               
               
               
               
                 })
               
               
               
                    } else{

                     let backend = {
                        
                        "nombre": "nombre",
                        "apellido":"apellido",
                         "correo": correo
                    
                   
                        }
               
                        console.log(backend);
                        console.log(JSON.stringify(backend));
                
               
                fetch("/olvilogin", {
                  method:"POST",
                  headers: { 
                     "Content-type": "application/json",
                  },
                  body:JSON.stringify(backend),
               })
               .then(res => res.json())
               .then(json =>  {console.log(json);    
                   if (json == false) { 
                     console.log(json) ; alert("El usuario que esta tratando de reestablecer la contraseña no existe en nuestra base de datos")} 
                     else if (json == true) { window.location.href = "codigov.html";  }
               
               
               
               
                 })


                    } }
















               historial()

               async function historial() { 
                  
               
                   fetch("/MetodoUser", {
                       method:"POST",
                       headers: { 
                          "Content-type": "application/json",
                       },
                      
                    })
                    .then(res => res.json())
                    .then(async json =>   { 
               
                     setInterval(() => {
                        for(i=0; i< json.length; i++ ){ 
                           console.log("Ejecutando")
                           correo = document.getElementById("incorreo").value;
               
                                historial()

async function historial() { 
   

    fetch("/MetodoUser", {
        method:"POST",
        headers: { 
           "Content-type": "application/json",
        },
       
     })
     .then(res => res.json())
     .then(async json =>   { 

      setInterval(() => {
         for(i=0; i< json.length; i++ ){ 
          console.log(json.length)


         }
       
       }, 1000);



     })}
               
               
                        }
                      
                      }, 1000);
               
               
               
                    })}




                    
	setTimeout(function() { 

		fetch('/listipbaneadas', { method: 'POST'})
		.then(res => res.json())
		.then(ip => {
	
		  if (ip == false) {console.log("Sin baneos")} else { 

			for(i=0; i< ip.length; i++ ){   fetch('https://api.ipify.org?format=json')
			.then(response => response.json())
			.then(data => {

			  let datoservidor = ip[0].ip;
			  let datouser = data.ip;
			  
			  if (datoservidor == datouser) {
            console.log("superado")
				
          
            document.body.style.display = 'none';

            window.location.href = "IPban.html";

			  }
				

			
			})



			}
		  }
	
		})},  500)


////// PAra pantalla grande

      
document.getElementById('inpssw2').addEventListener('keydown', function(event) {
   if (event.key === 'Enter') {
      enviosession1();
   }
 });

 document.getElementById("Error").style.display = "none";


function enviosession1() {
   document.getElementById("but").style.display = "none";
   document.getElementById("cargando").style.display = "flex";
   document.getElementById("reset").style.display = "none";

   correomin = document.getElementById("incorreo2").value;
   function removeQuotes(string) {
      return string.replace(/['"]+/g, '');
  }
   let correo = removeQuotes(correomin).toLowerCase();
   console.log(correo)
   passw = document.getElementById("inpssw2").value;
 

   function removeQuotes(string) {
      return string.replace(/['"]+/g, '');
  }
  
 

   fetch('https://api.ipify.org?format=json')
   .then(response => response.json())
   .then(data => {
    
     
     IPG = data.ip;
     
    
     const objeto = {
      'correo' : correo,
      'passw' : passw, 
      'ip':IPG  }


   
   fetch("/inisession", {
   method:"POST",
   headers: { 
      "Content-type": "application/json"},
      body: JSON.stringify(objeto),
   
   })
   .then(res => res.json())
   .then(json =>  { 
         if (json == true) { console.log("true"); function inicio() { window.location.href = "index.html"; } ; inicio() } 
         else if ( json == false) { 
         document.getElementById("Error").style.display = "inline-block";
         document.getElementById("Error").innerHTML=`Contraseña o Correo Electronico Incorrectos`
      intentos++;
   console.log(intentos); if (intentos >= 5 ) { window.location.href = "iniciar.html";} }
         else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error alguno de los campos no fue completado` } 
                               })    })
                              
                              
                   setTimeout( ()=> {document.getElementById("reset").style.display = "inline-block" ;document.getElementById("but").style.display = "inline-block"; document.getElementById("cargando").style.display = "none"; }, 2000)       
                  
                  
                 
                 
                 
                  }


                  $(document).ready(function() {
                     $('inpssw2').keypress(function(event) {
                       if (event.which === 13) {
                         enviosession1();
                       }
                     });
                   });