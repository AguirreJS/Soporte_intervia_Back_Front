function editarDominio(i) {

    let edit= "nombreDominio"+ i;
    console.log(edit)

let nuevoValor = prompt("Que nuevo nombre quieres para esta valor? ALERTA! Los cambios aqui realizados son Estrictos!! lo que significa que todo valor almacenado con este nombre sera modificado. Utilicelo como metodo de edicion mas no para otros fines.")
var viejoValor = document.getElementById(edit).innerHTML;

console.log(nuevoValor)

if (nuevoValor == "" || nuevoValor == null) { console.log("error")} else {

objeto =   { "viejoValor" : viejoValor,
            "nuevoValor" : nuevoValor,
            "protocolo" : "dominio",    }


fetch("/editorglobal", {
 method:"POST",
 headers: { 
    "Content-type": "application/json",
 },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {  



 }   )


 var loc = window.location;
 loc.reload();


 }}


 function editarEmpresa(i) {

    let edit= "nombreEmpresa"+ i;
    console.log(edit)

let nuevoValor = prompt("Que nuevo nombre quieres para esta valor? ALERTA! Los cambios aqui realizados son Estrictos!! lo que significa que todo valor almacenado con este nombre sera modificado. Utilicelo como metodo de edicion mas no para otros fines.")
var viejoValor = document.getElementById(edit).innerHTML;


console.log(nuevoValor)
if (nuevoValor == "" || nuevoValor == null) { console.log("error")} else {

objeto =   { "viejoValor" : viejoValor,
            "nuevoValor" : nuevoValor,
            "protocolo" : "empresa",    }


fetch("/editorglobal", {
 method:"POST",
 headers: { 
    "Content-type": "application/json",
 },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {  



 }   )

 var loc = window.location;
 loc.reload();


 }}





 function editarCorreo(i) {

    let edit= "tik"+i+"co";
    console.log(edit)

let nuevoValor = prompt("Que nuevo nombre quieres para esta valor? ALERTA! Los cambios aqui realizados son Estrictos!! lo que significa que todo valor almacenado con este nombre sera modificado. Utilicelo como metodo de edicion mas no para otros fines.")
var viejoValor = document.getElementById(edit).innerHTML;

if (nuevoValor == "" || nuevoValor == null) { console.log("error")} else {

objeto =   { "viejoValor" : viejoValor,
            "nuevoValor" : nuevoValor,
            "protocolo" : "correo",    }


fetch("/editorglobal", {
 method:"POST",
 headers: { 
    "Content-type": "application/json",
 },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {  



 }   )

 var loc = window.location;
 loc.reload();


 } }



 function editarNombre(i) {

    let edit= "tik"+i+"co";

    

let nuevoValor = prompt("Que nuevo nombre quieres para esta valor? ALERTA! Los cambios aqui realizados son Estrictos!! lo que significa que todo valor almacenado con este nombre sera modificado. Utilicelo como metodo de edicion mas no para otros fines.")
var viejoValor = document.getElementById(edit).innerHTML;


if (nuevoValor == "" || nuevoValor == null) { console.log("error")} else {
console.log(nuevoValor)

objeto =   { "viejoValor" : viejoValor,
            "nuevoValor" : nuevoValor,
            "protocolo" : "nombre",    }


fetch("/editorglobal", {
 method:"POST",
 headers: { 
    "Content-type": "application/json",
 },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {  



 }   )

 var loc = window.location;
 loc.reload();


 }}