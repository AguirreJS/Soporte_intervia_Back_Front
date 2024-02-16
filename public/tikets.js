
  const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    descripcion1: /^[a-zA-Z0-9\_\-]{4,300}$/, // Letras, numeros, guion y guion_bajo
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^\d{7,16}$/ // 7 a 14 numeros.
  }

  setInterval( ()=> { Verificador ()}, 1000)           
  setInterval( ()=> { Verificador1 ()}, 1000)   

let Valores = [false , false];


let ValoresT = [false , false];

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
 document.getElementById("alert5").style.display = "inline-block";
 document.getElementById("alert6").style.display = "inline-block";
  } else {
  document.getElementById("alert6").style.display = "none";
  document.getElementById("alert5").style.display = "none";
Valores[1] = true; } }





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
document.getElementById("alert5").style.display = "inline-block";
document.getElementById("alert6").style.display = "inline-block";
} else {
document.getElementById("alert6").style.display = "none";
document.getElementById("alert5").style.display = "none";
ValoresT[1] = true; } }
  




    const fecha = new Date();
    let dia = fecha.getDate();
    let mes1 = fecha.getMonth();
    let mes = mes1 + 1 ;
    let año = fecha.getFullYear();
   
 
    var fecha1 = dia +'/'+ mes +'/'+ año;







function ok1() { 
  const input = document.getElementById("imagen1");



  if (input.files.length > 0) { 
    const file = input.files[0];
    if (file.size/1000000 > 15) {
      alert("El archivo es demasiado grande, selecciona un archivo menor a 15MB.");
    } else {
    
 

  if (ValoresT[0] == true) {  

    
    
    fetch('/sessiononline', { method: 'GET'})
	.then(res => res.json())
	.then(data => {
   
  const input = document.getElementById("imagen1");
const file = input.files[0];
const reader = new FileReader();
reader.readAsDataURL(file);                    
    
    reader.onload = function() {
                          
                const tiketfinal = {
                                "nombre": data.nombre,
                                "apellido":data.apellido,
                              "correo":data.correo,
                             "empresa":data.empresa,
                            "asunto": document.getElementById("asunto1").value,
                             "descrip": document.getElementById("descrip1").value,
                             "anydesk":document.getElementById("any").value,
                            "estado" : "En Proceso",
                          "fecha" : fecha1,
                        "res" : "El ticket aun no esta resuelto.",
                        "imagen": reader.result }  






                                      fetch("/sendtiketimg", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                     if (json == true) {  window.location.href = "index.html";    }
                                                                       }) }})} else {alert("El asunto debe tener entre 4 y 40 caracteres")} 
                                                                    
                                                                      



    } }

                                                                    
                                                                      
                                                                      
                                                                      
                                                                       else {

if (ValoresT[0] == true) {  fetch('/sessiononline', { method: 'GET'})
	.then(res => res.json())
	.then(data => {
                          const tiketfinal = {
                                "nombre": data.nombre,
                                "apellido":data.apellido,
                              "correo":data.correo,
                             "empresa":data.empresa,
                            "asunto": document.getElementById("asunto1").value,
                             "descrip": document.getElementById("descrip1").value,
                             "anydesk":document.getElementById("any").value,
                            "estado" : "En Proceso",
                          "fecha" : fecha1,
                        "res" : "El ticket aun no esta resuelto." }  



                                      fetch("/sendtiket", {
                                        method:"POST",
                                        headers: {"Content-type":"application/json"},
                                        body: JSON.stringify(tiketfinal),})
                                        .then(res => res.json())
                                        .then(json =>  { 
                                                     if (json == true) {  window.location.href = "index.html";    }
                                                                       }) })} else {alert("El asunto debe tener entre 4 y 40 caracteres")}
                                                                      




                                                                      }                       
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      }




                  

                                                                      function ok() { 
                                                                        const input = document.getElementById("imagen");
                                                                      
                                                                      
                                                                      
                                                                        if (input.files.length > 0) { 
                                                                          const file = input.files[0];
                                                                          if (file.size/1000000 > 15) {
                                                                            alert("El archivo es demasiado grande, selecciona un archivo menor a 15MB.");
                                                                          } else {
                                                                          
                                                                       
                                                                      
                                                                        if (Valores[0] == true) {  
                                                                      
                                                                          
                                                                          
                                                                          fetch('/sessiononline', { method: 'GET'})
                                                                        .then(res => res.json())
                                                                        .then(data => {
                                                                         
                                                                        const input = document.getElementById("imagen");
                                                                      const file = input.files[0];
                                                                      const reader = new FileReader();
                                                                      reader.readAsDataURL(file);                    
                                                                          
                                                                          reader.onload = function() {
                                                                                                
                                                                                      const tiketfinal = {
                                                                                                      "nombre": data.nombre,
                                                                                                      "apellido":data.apellido,
                                                                                                    "correo":data.correo,
                                                                                                   "empresa":data.empresa,
                                                                                                  "asunto": document.getElementById("asunto").value,
                                                                                                   "descrip": document.getElementById("descrip").value,
                                                                                                   "anydesk":document.getElementById("any").value,
                                                                                                  "estado" : "En Proceso",
                                                                                                "fecha" : fecha1,
                                                                                              "res" : "El ticket aun no esta resuelto.",
                                                                                              "imagen": reader.result }  
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      
                                                                      
                                                                                                            fetch("/sendtiketimg", {
                                                                                                              method:"POST",
                                                                                                              headers: {"Content-type":"application/json"},
                                                                                                              body: JSON.stringify(tiketfinal),})
                                                                                                              .then(res => res.json())
                                                                                                              .then(json =>  { 
                                                                                                                           if (json == true) {  window.location.href = "index.html";    }
                                                                                                                                             }) }})} else {alert("El asunto debe tener entre 4 y 40 caracteres")} 
                                                                                                                                          
                                                                                                                                            
                                                                      
                                                                      
                                                                      
                                                                          } }
                                                                      
                                                                                                                                          
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
                                                                                                                                             else {
                                                                      
                                                                                                                                              if (Valores[0] == true) {  fetch('/sessiononline', { method: 'GET'})
                                                                      
                                                                          
                                                                      
                                                                      
                                                                        .then(res => res.json())
                                                                        .then(data => {
                                                                                                const tiketfinal = {
                                                                                                      "nombre": data.nombre,
                                                                                                      "apellido":data.apellido,
                                                                                                    "correo":data.correo,
                                                                                                   "empresa":data.empresa,
                                                                                                  "asunto": document.getElementById("asunto").value,
                                                                                                   "descrip": document.getElementById("descrip").value,
                                                                                                   "anydesk":document.getElementById("any").value,
                                                                                                  "estado" : "En Proceso",
                                                                                                "fecha" : fecha1,
                                                                                              "res" : "El ticket aun no esta resuelto." }  
                                                                      
                                                                      
                                                                      
                                                                                                            fetch("/sendtiket", {
                                                                                                              method:"POST",
                                                                                                              headers: {"Content-type":"application/json"},
                                                                                                              body: JSON.stringify(tiketfinal),})
                                                                                                              .then(res => res.json())
                                                                                                              .then(json =>  { 
                                                                                                                           if (json == true) {  window.location.href = "index.html";    }
                                                                                                                                             }) })} else {alert("El asunto debe tener entre 4 y 40 caracteres")}
                                                                                                                                            
                                                                      
                                                                      
                                                                      
                                                                      
                                                                                                                                            }                       
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            }
                                                                      
                                                                      
                                                                      
                                                                      
                                                                                        
                                                                      
                                                                      