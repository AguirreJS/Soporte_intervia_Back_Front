


 




const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{4,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{7,16}$/ // 7 a 14 numeros.
}



 setInterval( ()=> { Verificador ()}, 1000)           

let Valores = [false,false,false];

function Verificador () {
console.log("ejecutando")
   let nombre = document.getElementById("nombre").value; 
   let apellido = document.getElementById("apellido").value;
   function removeQuotes(string) {
      return string.replace(/["']/g, "");
  }
   
    let correoantimysql = document.getElementById("correo").value; 
    let correo = removeQuotes(correoantimysql);
   let pass = document.getElementById("pass").value; 
   let pass2 = document.getElementById("pass2").value; 
   let nacimiento = document.getElementById("nacimiento").value; 
   let telefono = document.getElementById("telefono").value; 




      if (expresiones.usuario.test(nombre) == false ) {
          document.getElementById("nombreid").style.display = "inline-block";
          document.getElementById("alert1").style.display = "inline-block";
           } 
          
          else { document.getElementById("nombreid").style.display = "none";
                  document.getElementById("alert1").style.display = "none";
               Valores[0] = true; }
   
         if (expresiones.usuario.test(apellido) == false ) {
                     document.getElementById("apellidoid").style.display = "inline-block";
                     document.getElementById("alert2").style.display = "inline-block";
                      } 
                     
                     else { document.getElementById("apellidoid").style.display = "none";
                             document.getElementById("alert2").style.display = "none";
                             Valores[1] = true; }
   


/////////////////////////

                             if (expresiones.correo.test(correo) == false ) {
                              document.getElementById("correoid").style.display = "inline-block";
                              document.getElementById("alert3").style.display = "inline-block";
                               } 
                              
                              else { document.getElementById("correoid").style.display = "none";
                                      document.getElementById("alert3").style.display = "none";
                                   Valores[2] = true; }


    ///////////////////////////

    if (expresiones.password.test(pass) == true ) { 
             document.getElementById("pssid").style.display = "none";
              document.getElementById("alert5").style.display = "none";
           Valores[3] = true; 
       } 
      
      else {  document.getElementById("pssid").style.display = "inline-block";
      document.getElementById("alert6").style.display = "inline-block"; }

        //////////////////////////    

        if ( pass == pass2 ) { 
         document.getElementById("pssid2").style.display = "none";
          document.getElementById("alert6").style.display = "none";
       Valores[4] = true; 
   } 
  
  else {  document.getElementById("pssid2").style.display = "inline-block";
  document.getElementById("alert6").style.display = "inline-block"; }
          
                


                
//////////////////////

           if ( expresiones.telefono.test(telefono) ) {  document.getElementById("telefonoid").style.display = "none";
           document.getElementById("alert4").style.display = "none";
        Valores[5] = true;
         
            } 
           
           else { document.getElementById("telefonoid").style.display = "inline-block";
           document.getElementById("alert4").style.display = "inline-block";  }

           if (   Valores[0] == true && Valores[1] == true && Valores[2] == true && Valores[3] == true && Valores[4] == true && Valores[5] == true) {

                      document.getElementById("okey").style.display = "inline";

           } else {    document.getElementById("okey").style.display = "none"; }
    
     
   
   }
   
   


























   function envioLogin() {

    if (   Valores[0] == true && Valores[1] == true && Valores[2] == true && Valores[3] == true && Valores[4] == true && Valores[5] == true) {
    

      function removeQuotes(string) {
         return string.replace(/["']/g, "");
     }
      
       let correoantimysql = document.getElementById("correo").value; 
       let correo = removeQuotes(correoantimysql);
      let nombre = document.getElementById("nombre").value; 
      let apellido = document.getElementById("apellido").value;
      let passantimsql = document.getElementById("pass").value; 
      let pass = removeQuotes(passantimsql);
      let nacimiento = document.getElementById("nacimiento").value; 
      let telefono = document.getElementById("telefono").value; 

      
   

    let backend = {
      	
      	"nombre": nombre,
      	"apellido":apellido,
   		 "correo":correo,
  		"pass":pass,
     	"empresa":empresa(),
      	"nacimiento":nacimiento,
     	"anydesk":"Sin anydesk",
     	"telefono":telefono,
     	"valid2" : 0,
     	"valid3" : 0,
     	"valid4" : 0,
     	"valid5" : 0,
     
    
			}

			console.log(backend);
			console.log(JSON.stringify(backend));
 

 fetch("/logeo", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
   body:JSON.stringify(backend),
})
.then(res => res.json())
.then(json =>  {console.log(json);     if (json == true) { window.location.href = "codigov.html"; } else if (json == false) { document.getElementById("Error").innerHTML=`El usuario ya Existe se le envio una clave a su correo para reestablecer la contraseña has click en el enlace enviado y podras establecer una nueva contraseña`  }




  })


    } else {  alert("Algunos de los campos no fueron rellenados correctamente, verifique las letras en rojo o los iconos al lado de cada formulario") }
}








 

function empresa() {
      
   let emp = document.getElementById("correo").value;
    const lastIndex = emp.lastIndexOf('@');
    return emp.slice(lastIndex + 1, emp.length);

}


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

         
       
         document.body.style.display = 'none';

         window.location.href = "IPban.html";
        }
         

      
      })



      }
     }

   })}, 500)