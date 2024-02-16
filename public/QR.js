




const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    descripcion1: /^[a-zA-Z0-9\_\-]{4,300}$/, // Letras, numeros, guion y guion_bajo
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^\d{7,16}$/ // 7 a 14 numeros.
  }





  function Verificador1 () {
    let validarAsunto = document.getElementById("asunto1").value;
    let descripcion = document.getElementById("descrip1").value;
  if (expresiones.nombre.test(validarAsunto) == false ) {
  document.getElementById("alert1").style.display = "inline-block";
  document.getElementById("alert2").style.display = "inline-block";
  } else {
  document.getElementById("alert1").style.display = "none";
  document.getElementById("alert2").style.display = "none";
  ValoresT[0] = true; }
  
  if (expresiones.descripcion1.test(descripcion) == false ) {
  
  } else {

  ValoresT[1] = true; } console.log("Listo") }
    
  

function Verificador () {
    let validarAsunto = document.getElementById("asunto").value;
    let descripcion = document.getElementById("descrip").value;
if (expresiones.nombre.test(validarAsunto) == false ) {
 document.getElementById("alert1").style.display = "inline-block";
 document.getElementById("alert2").style.display = "inline-block";
  } else {
  document.getElementById("alert1").style.display = "none";
  document.getElementById("alert2").style.display = "none";
Valores[0] = true; }



if (expresiones.descripcion1.test(descripcion) == false ) {

  } else {

Valores[1] = true; } }





let Valores = [true ,true];


let ValoresT = [true , true];










    const fecha = new Date();
    let dia = fecha.getDate();
    let mes1 = fecha.getMonth();
    let mes = mes1 + 1 ;
    let año = fecha.getFullYear();
   
 
    var fecha1 = dia +'/'+ mes +'/'+ año;







function ok1() { 
       
var urlActual = window.location.href;
var codigo = urlActual.match(/\/([^\/]+)$/)[1];


  const input = document.getElementById("imagen1");
  if (input.files.length > 0) {  /* Con imagen */  console.log("Con imagen")
    const file = input.files[0];
    if (file.size/1000000 > 15) {
      alert("El archivo es demasiado grande, selecciona un archivo menor a 15MB.");
    } else {
    
 

  if (ValoresT[0] == true) {  



const input = document.getElementById("imagen1");
const file = input.files[0];
const reader = new FileReader();
reader.readAsDataURL(file);                    
    
    reader.onload = function() {
                          
                const tiketfinal = {
                            "Codigov": codigo,
                            "asunto": document.getElementById("asunto1").value,
                             "descrip": document.getElementById("descrip1").value,
                             "anydesk":document.getElementById("any").value,
                            "estado" : "En Proceso",
                          "fecha" : fecha1,
                        "res" : "El ticket aun no esta resuelto.",
                        "imagen": reader.result }  






                                      fetch("/sendtiketimgQR", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                     if (json == true) { 
                                                      
                                                        alert("El ticket fue enviado correctamente")
                                                      window.location.href = "../index.html";    }
                                                                       }) }} else {alert("El asunto debe tener entre 4 y 40 caracteres")} 
                                                                    
                                                                      



    } }   else {      /* Sin imagen */ console.log("Sin imagen")

if (ValoresT[0] == true) { 
    
    

            
        
            const tiketfinal = {
            "Codigov": codigo,
            "asunto": document.getElementById("asunto1").value,
             "descrip": document.getElementById("descrip1").value,
             "anydesk":document.getElementById("any").value,
            "estado" : "En Proceso",
          "fecha" : fecha1,
        "res" : "El ticket aun no esta resuelto."
     }  



                                      fetch("/sendtiketQR", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                     if (json == true) {  
                                                      alert("El ticket fue enviado correctamente")
                                                      window.location.href = "../index.html";    }
                                                                       }) } else {alert("El asunto debe tener entre 4 y 40 caracteres")}
                                                                      




                                                                      }                       
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      }





function ok1() { 
       
var urlActual = window.location.href;
var codigo = urlActual.match(/\/([^\/]+)$/)[1];


  const input = document.getElementById("imagen1");
  if (input.files.length > 0) {  /* Con imagen */  console.log("Con imagen")
    const file = input.files[0];
    if (file.size/1000000 > 15) {
      alert("El archivo es demasiado grande, selecciona un archivo menor a 15MB.");
    } else {
    
 

  if (Valores[1] == true) {  



const input = document.getElementById("imagen1");
const file = input.files[0];
const reader = new FileReader();
reader.readAsDataURL(file);                    
    
    reader.onload = function() {
                          
                const tiketfinal = {
                            "Codigov": codigo,
                            "asunto": document.getElementById("asunto1").value,
                             "descrip": document.getElementById("descrip1").value,
                             "anydesk":document.getElementById("any").value,
                            "estado" : "En Proceso",
                          "fecha" : fecha1,
                        "res" : "El ticket aun no esta resuelto.",
                        "imagen": reader.result }  






                                      fetch("/sendtiketimgQR", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                     if (json == true) { 
                                                      
                                                        alert("El ticket fue enviado correctamente")
                                                      window.location.href = "../index.html";    }
                                                                       }) }} else {alert("El asunto debe tener entre 4 y 40 caracteres")} 
                                                                    
                                                                      



    } }   else {      /* Sin imagen */ console.log("Sin imagen")

if (Valores[1] == true) { 
    
    

            
        
            const tiketfinal = {
            "Codigov": codigo,
            "asunto": document.getElementById("asunto1").value,
             "descrip": document.getElementById("descrip1").value,
             "anydesk":document.getElementById("any").value,
            "estado" : "En Proceso",
          "fecha" : fecha1,
        "res" : "El ticket aun no esta resuelto."
     }  



                                      fetch("/sendtiketQR", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                     if (json == true) {  
                                                      alert("El ticket fue enviado correctamente")
                                                      window.location.href = "../index.html";    }
                                                                       }) } else {alert("El asunto debe tener entre 4 y 40 caracteres")}
                                                                      




                                                                      }                       
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      }
                                                                      

function ok() { 
       
  var urlActual = window.location.href;
  var codigo = urlActual.match(/\/([^\/]+)$/)[1];
  
  
    const input = document.getElementById("imagen");
    if (input.files.length > 0) {  /* Con imagen */  console.log("Con imagen")
      const file = input.files[0];
      if (file.size/1000000 > 15) {
        alert("El archivo es demasiado grande, selecciona un archivo menor a 15MB.");
      } else {
      
   
  
    if (Valores[0] == true) {  
  
  
  
  const input = document.getElementById("imagen");
  const file = input.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);                    
      
      reader.onload = function() {
                            
                  const tiketfinal = {
                              "Codigov": codigo,
                              "asunto": document.getElementById("asunto").value,
                               "descrip": document.getElementById("descrip").value,
                               "anydesk":document.getElementById("any").value,
                              "estado" : "En Proceso",
                            "fecha" : fecha1,
                          "res" : "El ticket aun no esta resuelto.",
                          "imagen": reader.result }  
  
  
  
  
  
  
                                        fetch("/sendtiketimgQR", {
                                          method:"POST",
                                          headers: {"Content-type":"application/json"},
                                          body: JSON.stringify(tiketfinal),})
                                          .then(res => res.json())
                                          .then(json =>  { 
                                                       if (json == true) { 
                                                        
                                                          alert("El ticket fue enviado correctamente")
                                                        window.location.href = "../index.html";    }
                                                                         }) }} else {alert("El asunto debe tener entre 4 y 40 caracteres")} 
                                                                      
                                                                        
  
  
  
      } }   else {      /* Sin imagen */ console.log("Sin imagen")
  
  if (Valores[0] == true) { 
      
      
  
              
          
              const tiketfinal = {
              "Codigov": codigo,
              "asunto": document.getElementById("asunto").value,
               "descrip": document.getElementById("descrip").value,
               "anydesk":document.getElementById("any").value,
              "estado" : "En Proceso",
            "fecha" : fecha1,
          "res" : "El ticket aun no esta resuelto."
       }  
  
  
  
                                        fetch("/sendtiketQR", {
                                          method:"POST",
                                          headers: {"Content-type":"application/json"},
                                          body: JSON.stringify(tiketfinal),})
                                          .then(res => res.json())
                                          .then(json =>  { 
                                                       if (json == true) {  
                                                        alert("El ticket fue enviado correctamente")
                                                        window.location.href = "../index.html";    }
                                                                         }) } else {alert("El asunto debe tener entre 4 y 40 caracteres")}
                                                                        
  
  
  
  
                                                                        }                       
                                                                        
                                                                        
                                                                        
                                                                        
                                                                        
                                                                        }



 alerta ()


function alerta () {


  var urlActual = window.location.href;
  var codigo = urlActual.match(/\/([^\/]+)$/)[1];


objeto =   { "codigo" : codigo,
                }


fetch("/codigovQR", {
 method:"POST",
 headers: { 
    "Content-type": "application/json",
 },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {  

  var divElement = document.getElementById("menuEmergente");
  var h1Element = document.createElement("h1");
  h1Element.innerText = "Estás iniciando un ticket en nombre de " + json.nombre;
  divElement.appendChild(h1Element);

  var buttonElement = document.createElement("button");
  buttonElement.innerText = "Aceptar";
  buttonElement.onclick = function() {
    aceptar();
  }

  divElement.appendChild(buttonElement);




 }   ) }


 
function aceptar () {

  var divElement = document.getElementById("menuEmergente");
  divElement.style.display = "none";
  
  var divElement1 = document.getElementById("fondoblack");
  divElement1.style.display = "none";



}


function toggleDisplay() {
  var element = document.getElementById("menutelefonosdes");
  if (element.style.display === "none") {
    element.style.display = "inline-block";
  } else {
    element.style.display = "none";
  }
  }
