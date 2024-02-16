


EnvioGet();

function EnvioGet() { 

	fetch('/sessiononline', { method: 'GET'})
	.then(res => res.json())
	.then(data => {

	  if (data.online == true) { 
									
								 GeneraQR (data.codigov)
								document.getElementById("Usuario").innerHTML=`${data.nombre}`
	 							 document.getElementById("Usuario").style.display = "inline-block"
	                             document.getElementById("iniciar").style.display ="none";	
								 document.getElementById("regis").style.display = "none";
								 document.getElementById("salir").style.display = "inline-block";
								 document.getElementById("Usuario1").style.display = "inline-block";}

		else				    { document.getElementById("salir").style.display = "none";
									document.getElementById("codigoQR").style.display = "none";			}

	})} 




function GeneraQR (correo) {

	console.log(correo)

const CodigoQR =  document.getElementById('codigoQR')

new QRCode ( CodigoQR , "https://www.soporte.intervia.com.ar/ticketQR/" + correo)

var divElement = document.getElementById("codigoQR");
var aElement = document.createElement("a");
aElement.href = "/ticketQR/" + correo;
aElement.innerText = "Para gurdar el enlace de este QR has Click Aqui.";
divElement.appendChild(aElement);






  } 























function salir() { 

	fetch('/salir', { method: 'GET'})
	.then(res => res.json())
	.then(data => {

	  function salir() { window.location.href = "index.html"; } ; salir()

	})} 

	function toggleDisplay() {
		var element = document.getElementById("menutelefonosdes");
		if (element.style.display === "none") {
		  element.style.display = "inline-block";
		} else {
		  element.style.display = "none";
		}
	  }


	  EnvioGetResponsive()

	  function EnvioGetResponsive() { 

		fetch('/sessiononline', { method: 'GET'})
		.then(res => res.json())
		.then(data => {
	
		  if (data.online == true) { 
									
								
								
									 document.getElementById("registro2").style.display ="none";
									 document.getElementById("registro1").style.display ="none";
									 document.getElementById("salirR").style.display = "inline-block";
								}
	
			else				    { document.getElementById("salirR").style.display = "none";}
	
		})} 









		
function mostrarVentanaEmergente() {
	var ventanaEmergente = document.getElementById("miVentanaEmergente");
	ventanaEmergente.style.display = "block"; // Muestra la ventana emergente
  }
  
  function enviosession1() {
	
	

 
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





				   document.getElementById("inpssw2").addEventListener("keydown", function(event) {
					if (event.key === "Enter") {
						enviosession1(); // Llama a la función cuando se presiona "Enter"
					}
				  });