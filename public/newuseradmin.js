




function okrestablecerPsw() {
	let nacimiento = document.getElementById("nacimiento").value; 

	let nombre = document.getElementById("Nombre").value; 

	let apellido = document.getElementById("Apellido").value; 

	console.log(nacimiento)

	const path = window.location.pathname;
const regex = /([a-zA-Z0-9]+$)/;
const match = path.match(regex);
const code = match ? match[0] : null;

	
let codigov =  code;

let npsw = document.getElementById("npsw").value; 

let rpsw =  document.getElementById("rpsw").value;

  if( apellido == "" || nombre == "" || npsw != rpsw ) {
	document.getElementById("Error2").innerHTML=`
	Alguno de los valores no fueron rellenados correctamente`
  } else {
	

	console.log("ejecutando 1")
	let objeto3 = {
		'nombre' : nombre,
	'apellido': apellido,
	'codigov' : codigov,
	'npsw': npsw,
'nacimiento':nacimiento }      
          

fetch("/pswregen1", {
	
	method:"POST",
	headers: {"Content-type":"application/json"},
	   body: JSON.stringify(objeto3),})
	   .then(res => res.json())
	   .then(json =>  { 
			 if (json == true) {   console.log("true"); window.location.href = "../iniciar.html";  } 
			 else if ( json == false) { console.log("false")
			 document.getElementById("Error2").innerHTML=`
			 No se pudo reestablecer la contraseña, es posible que las contraseñas que indico no sean iguales o bien esta intentado reestablecer 
			 una contraseña que ya se reestablecio si se olvido la contraseña cominuquese con el administrador` }
			 else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error inesperado` } 
								   })  } }




								   

function okrestablecerPsw2() {
	let nacimiento = document.getElementById("nacimiento1").value; 

	let nombre = document.getElementById("Nombre1").value; 

	let apellido = document.getElementById("Apellido1").value; 

	console.log(nacimiento)

	const path = window.location.pathname;
const regex = /([a-zA-Z0-9]+$)/;
const match = path.match(regex);
const code = match ? match[0] : null;

	
let codigov =  code;

let npsw = document.getElementById("npsw1").value; 

let rpsw =  document.getElementById("rpsw1").value;

  if( apellido == "" || nombre == "" || npsw != rpsw ) {
	document.getElementById("Error2").innerHTML=`
	Alguno de los valores no fueron rellenados correctamente`
  } else {
	

	console.log("ejecutando 1")
	let objeto3 = {
		'nombre' : nombre,
	'apellido': apellido,
	'codigov' : codigov,
	'npsw': npsw,
'nacimiento':nacimiento }      
          

fetch("/pswregen1", {
	
	method:"POST",
	headers: {"Content-type":"application/json"},
	   body: JSON.stringify(objeto3),})
	   .then(res => res.json())
	   .then(json =>  { 
			 if (json == true) {   console.log("true"); window.location.href = "../iniciar.html";  } 
			 else if ( json == false) { console.log("false")
			 document.getElementById("Error2").innerHTML=`
			 No se pudo reestablecer la contraseña, es posible que las contraseñas que indico no sean iguales o bien esta intentado reestablecer 
			 una contraseña que ya se reestablecio si se olvido la contraseña cominuquese con el administrador` }
			 else if (data.online == undefined){ document.getElementById("Error").innerHTML=`Error inesperado` } 
								   })  } }
