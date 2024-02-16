




EnvioGet();

function EnvioGet() { 

	fetch('/sessiononline', { method: 'GET'})
	.then(res => res.json())
	.then(data => {

	  if (data.online == true) { 
									
							
								document.getElementById("Usuario").innerHTML=`${data.nombre}`
	 							 document.getElementById("Usuario").style.display = "inline-block"
	                             document.getElementById("iniciar").style.display ="none";	
								 document.getElementById("regis").style.display = "none";
								 document.getElementById("salir").style.display = "inline-block";
								 document.getElementById("Usuario1").style.display = "inline-block";}

		else				    { document.getElementById("salir").style.display = "none";}

	})} 




function GeneraQR (correo) {

	console.log(correo)

const CodigoQR =  document.getElementById('codigoQR')

new QRCode ( CodigoQR , "https://www.soporte.intervia.com.ar/ticketQR/" + correo)




  } 


        
document.getElementById('inpssw2').addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
	   enviosession1();
	}
  });


  $(document).ready(function() {
	$('inpssw2').keypress(function(event) {
	  if (event.which === 13) {
		enviosession1();
	  }
	});
  });






















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