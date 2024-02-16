


 function validarCodigo() {
	
	let codigov = document.getElementById("codigov").value; 

	let objeto = {
		'codigov' : document.getElementById("codigov").value,
	     'zin': true  };

fetch("/codigosession", {
	method:"POST",
	headers: {"Content-type":"application/json"},
	   body: JSON.stringify(objeto),})
	   .then(res => res.json())
	   .then(json =>  { 
			 if (json == true) { console.log("true"); function inicio() { window.location.href = "iniciar.html"; } ; inicio() } 
			 else if ( json == false) { console.log("false")
			 document.getElementById("Error").innerHTML=`Codigo incorrecto` }
			 else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error inesperado` } 
								   }) 




}


function restablecerPsw() {




	let objeto = {
		'codigov' : document.getElementById("codigov").value,
	     'zin': true  };

fetch("/codigosession", {
	
	method:"POST",
	headers: {"Content-type":"application/json"},
	   body: JSON.stringify(objeto),})
	   .then(res => res.json())
	   .then(json =>  { 
			 if (json == true) { console.log("true"); document.getElementById("psw").style.display = "inline-block";document.getElementById("codigov").style.display = "none" ;  } 
			 else if ( json == false) { console.log("false")
			 document.getElementById("Error").innerHTML=`Codigo incorrecto` }
			 else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error inesperado` } 
								   }) 
}


function okrestablecerPsw() {
	
	var x1 = document.getElementById("bnone");
	x1.style.display = "none";
  
	var x2 = document.getElementById("bnone2");
	x2.style.display = "none";

let codigov = document.getElementById("codigov").value; 

let npsw = document.getElementById("npsw").value; 

let rpsw =  document.getElementById("rpsw").value;

let iguales = undefined;

function igualesps (){ if ( npsw == rpsw ) {  iguales = true;  return iguales} else if (npsw != rpsw) {  document.getElementById("Error2").innerHTML=`LAS CONTRASEÑAS NO SON IGUALES` };    }
let valid = igualesps()
function valenviar (){ if ( valid == true){  
	
	let objeto3 = {
	'codigov' : codigov,
	'npsw': npsw }      
	return objeto3              } } 



fetch("/pswregen", {
	
	method:"POST",
	headers: {"Content-type":"application/json"},
	   body: JSON.stringify(valenviar()),})
	   .then(res => res.json())
	   .then(json =>  { 
			 if (json == true) {   console.log("true"); window.location.href = "iniciar.html";  } 
			 else if ( json == false) { console.log("false")
			 document.getElementById("Error2").innerHTML=`
			 No se pudo reestablecer la contraseña, es posible que las contraseñas que indico no sean iguales o bien esta intentado reestablecer 
			 una contraseña que ya se reestablecio si se olvido la contraseña cominuquese con el administrador` }
			 else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error inesperado` } 
								   }) 


}