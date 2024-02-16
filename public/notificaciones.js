






function actualizarnotificaciones() {


	contraseña = prompt("Esta funcion solo esta permitida para el desarrollador del sitio.")

	if(contraseña == "loquendo") {

    console.log("Ejecutando")

Valor = prompt("ingrese el nuevo valor para todos los usuarios")


nivel =   { "valor" : Valor,
                     }

					 fetch("/reestablecernotificaciones", {
						method:"POST",
						headers: { 
						   "Content-type": "application/json",
						},
					 body: JSON.stringify( nivel )})
					 .then(res => res.json())
					 .then(json =>   {  
					 
						if (json == true) { window.location.href = "lusuarios"; } 
					 
					 
						}   )


	} else { alert("Contraseña incorrecta")}

	

             
   




}
















document.addEventListener("DOMContentLoaded", function() {
   var input = document.getElementById("buscador");
   input.addEventListener("input", miFuncion);
 
   function miFuncion() {

      remover()
   

      let buscador = document.getElementById("buscador").value; 
   
      if (buscador.value == "") { console.log("Vacio") } else {

         let parametroEnviar=[];
         let z=0


         function BuscarPropiedad() {
if(input.value == "") { remover() }

            return new Promise((resolve, reject) => {
               for(i=0; i< BusArrayd.length; i++ ){
                  const indice = BusArrayd[i].correo.indexOf(input.value);
                  const indice2 = BusArrayd[i].nombre.indexOf(input.value);
                  const indice3 = BusArrayd[i].apellido.indexOf(input.value);
                  const indice4 = BusArrayd[i].empresa.indexOf(input.value);
                  if (indice !== -1 || indice2 !== -1 || indice3 !== -1 || indice4 !== -1  ) { 
                     
                     parametroEnviar[z]= BusArrayd[i];
                     z++
                  
                  } 
               
               
              }
          
              resolve(parametroEnviar);
            });
          }
          
      
      
          BuscarPropiedad().then(() => {
          
            historial(parametroEnviar); 
          
          });}}
 });







fetch("/listausu", {
   method: "POST",
   headers: {"Content-type": "application/json"},
 })
 .then(res => res.json())
 .then(json => {
   const transformToLower = (obj) => {
     for (let prop in obj) {
       if (typeof obj[prop] === 'string') {
         obj[prop] = obj[prop].toLowerCase();
       } else if (typeof obj[prop] === 'object') {
         transformToLower(obj[prop]);
       }
     }
   }
 

   transformToLower(json);
 
  
   BusArrayd = json
 })
 .catch(error => console.error(error));

let BusArrayd;



function remover() {
   let elementos = document.querySelectorAll('.deleTotal');
   elementos.forEach(function(elemento) {
       elemento.remove();
   });

}
   








async function historial(parametro) { 
console.log(BusArrayd)

   document.getElementById("buscar1").style.display = "none";

   console.log("ejecutando")
 

   

      let reversa = parametro;

      

   
      
      for(i=0; i< reversa.length; i++ ){

       function transformador(v) {

        if(v=="0"){return "No"}else if(v=="1"){return "Si"}
       }

         let empresa3 = reversa[i].empresa;

         
      

        

            const btn = document.getElementById("delete")
            const btne = document.createElement("p")
            btne.setAttribute(`class` , `button12 deleTotal` )
            btne.setAttribute(`id` , `tik${i}d` )
            btne.setAttribute(`onclick` , `solicitarRegistro( 'tik${i}co' )` );
            btne.textContent = "Enviar Email";
            btn.appendChild(btne)
        

      const correo = document.getElementById("correo")
      const correoe = document.createElement("p")
      correoe.setAttribute(`class` , `button12 deleTotal` )
      correoe.setAttribute(`onclick` , `editarCorreo( '${i}' )` );
      correoe.setAttribute(`id` , `tik${i}co` )
      correoe.textContent = reversa[i].correo;
      correo.appendChild(correoe)

      const nombre = document.getElementById("nombre")
      const nombree = document.createElement("p")
      nombree.setAttribute(`class` , `deleTotal` )
      nombree.setAttribute(`onclick` , `editarNombre( '${i}' )` );
      nombree.setAttribute(`id` , `tik${i}nom` )
      nombree.textContent = reversa[i].nombre;
      nombre.appendChild(nombree);



      const b1n1 = document.getElementById("b1n1")
      const b1n1a = document.createElement("p")
      b1n1a.setAttribute(`class` , ` deleTotal` )
      b1n1a.setAttribute(`onclick` , `ModNotificador( '${i}', 'b1n1${i}' )` );
      b1n1a.setAttribute(`id` , `b1n1${i}` )
      b1n1a.textContent = transformador(reversa[i].valid5[0]);
      b1n1.appendChild(b1n1a);
      
   
      const b1n2 = document.getElementById("b1n2")
      const b1n2a = document.createElement("p")
      b1n2a.setAttribute(`class` , ` deleTotal` )
      b1n2a.setAttribute(`onclick` , `ModNotificador( '${i}', 'b1n2${i}' )` );
      b1n2a.setAttribute(`id` , `b1n2${i}` )
      b1n2a.textContent = transformador(reversa[i].valid5[1]);
      b1n2.appendChild(b1n2a);


      const b1n3 = document.getElementById("b1n3")
      const b1n3a = document.createElement("p")
      b1n3a.setAttribute(`class` , ` deleTotal` )
      b1n3a.setAttribute(`onclick` , `ModNotificador( '${i}', 'b1n3${i}' )`  );
      b1n3a.setAttribute(`id` , `b1n3${i}` )
      b1n3a.textContent = transformador(reversa[i].valid5[2]);
      b1n3.appendChild(b1n3a);

      const a1n1 = document.getElementById("a1n1")
      const a1n1a = document.createElement("p")
      a1n1a.setAttribute(`class` , ` deleTotal` )
      a1n1a.setAttribute(`onclick` , `ModNotificador( '${i}', 'a1n1${i}' )`  );
      a1n1a.setAttribute(`id` , `a1n1${i}` )
      a1n1a.textContent = transformador(reversa[i].valid5[3]);
      a1n1.appendChild(a1n1a);

      const a1n2 = document.getElementById("a1n2")
      const a1n2a = document.createElement("p")
      a1n2a.setAttribute(`class` , ` deleTotal` )
      a1n2a.setAttribute(`onclick` , `ModNotificador( '${i}', 'a1n2${i}' )`  );
      a1n2a.setAttribute(`id` , `a1n2${i}` )
      a1n2a.textContent = transformador(reversa[i].valid5[4]);
      a1n2.appendChild(a1n2a);
      
      const a1n3 = document.getElementById("a1n3")
      const a1n3a = document.createElement("p")
      a1n3a.setAttribute(`class` , ` deleTotal` )
      a1n3a.setAttribute(`onclick` , `ModNotificador( '${i}', 'a1n3${i}' )`  );
      a1n3a.setAttribute(`id` , `a1n3${i}` )
      a1n3a.textContent = transformador(reversa[i].valid5[5]);
      a1n3.appendChild(a1n3a);

      const f1n1 = document.getElementById("f1n1")
    const f1n1a = document.createElement("p")
    f1n1a.setAttribute(`class` , ` deleTotal` )
    f1n1a.setAttribute(`onclick` , `ModNotificador( '${i}', 'f1n1${i}' )`  );
    f1n1a.setAttribute(`id` , `f1n1${i}` )
    f1n1a.textContent = transformador(reversa[i].valid5[6]);
    f1n1.appendChild(f1n1a);

    const f1n2 = document.getElementById("f1n2")
    const f1n2a = document.createElement("p")
    f1n2a.setAttribute(`class` , ` deleTotal` )
    f1n2a.setAttribute(`onclick` , `ModNotificador( '${i}', 'f1n2${i}' )`  );
    f1n2a.setAttribute(`id` , `f1n2${i}` )
    f1n2a.textContent = transformador(reversa[i].valid5[7]);
    f1n2.appendChild(f1n2a);

    const f1n3 = document.getElementById("f1n3")
const f1n3a = document.createElement("p")
f1n3a.setAttribute(`onclick` , `ModNotificador( '${i}', 'f1n3${i}' )`  );
f1n3a.setAttribute(`class` , ` deleTotal` )
f1n3a.setAttribute(`id` , `f1n3${i}` )
f1n3a.textContent = transformador(reversa[i].valid5[8]);
f1n3.appendChild(f1n3a);


const e1n1 = document.getElementById("e1n1")
const e1n1a = document.createElement("p")
e1n1a.setAttribute(`class` , ` deleTotal` )
e1n1a.setAttribute(`onclick` , `ModNotificador( '${i}', 'e1n1${i}' )`  );
e1n1a.setAttribute(`id` , `e1n1${i}` )
e1n1a.textContent = transformador(reversa[i].valid5[9]);
e1n1.appendChild(e1n1a);

const e1n2 = document.getElementById("e1n2")
const e1n2a = document.createElement("p")
e1n2a.setAttribute(`class` , ` deleTotal` )
e1n2a.setAttribute(`onclick` , `ModNotificador( '${i}', 'e1n2${i}' )`  );
e1n2a.setAttribute(`id` , `e1n2${i}` )
e1n2a.textContent = transformador(reversa[i].valid5[10]);
e1n2.appendChild(e1n2a);

const e1n3 = document.getElementById("e1n3")
const e1n3a = document.createElement("p")
e1n3a.setAttribute(`class` , ` deleTotal` )
e1n3a.setAttribute(`onclick` , `ModNotificador( '${i}', 'e1n3${i}' )`  );
e1n3a.setAttribute(`id` , `e1n3${i}` )
e1n3a.textContent = transformador(reversa[i].valid5[11]);
e1n3.appendChild(e1n3a);


const F1T = document.getElementById("F1T")
const F1Ta = document.createElement("p")
F1Ta.setAttribute(`class` , ` deleTotal` )
F1Ta.setAttribute(`onclick` , `ModNotificador( '${i}', 'F1T${i}' )`  );
F1Ta.setAttribute(`id` , `F1T${i}` )
F1Ta.textContent = transformador(reversa[i].valid5[12]);
F1T.appendChild(F1Ta);

const F1T1 = document.getElementById("butmodi")
const F1Ta1 = document.createElement("button")
F1Ta1.setAttribute(`class` , ` deleTotal` )
F1Ta1.setAttribute(`onclick` , `ModGeneral( '${i}', 'F1T${i}' )`  );
F1Ta1.setAttribute(`id` , `F1T${i}` )
F1Ta1.textContent = "Actualizar";
F1T1.appendChild(F1Ta1);


        
      
     

     
      
    
   
   
    }
        
     
  }





 


function ModNotificador( A , B ) {

console.log(A)
console.log(B)
var p = document.getElementById(B);

if (p.innerHTML == "No") { p.innerHTML = "Si"; } else { p.innerHTML = "No";}





}

function ModGeneral(i) {


    let correo1 = "tik"+ i + "co";
    var correo2 = document.getElementById(correo1);
    let correo = correo2.innerHTML;
    console.log(correo)

let op0 = "b1n1" + i;
var aop0 = document.getElementById(op0);
let op1 = "b1n2" + i;
var aop1 = document.getElementById(op1);
let op2 = "b1n3" + i;
var aop2 = document.getElementById(op2);
let op3 = "a1n1" + i;
var aop3 = document.getElementById(op3);
let op4 = "a1n2" + i;
var aop4 = document.getElementById(op4);
let op5 = "a1n3" + i;
var aop5 = document.getElementById(op5);
let op6 = "f1n1" + i;
var aop6 = document.getElementById(op6);
let op7 = "f1n2" + i;
var aop7 = document.getElementById(op7);
let op8 = "f1n3" + i;
var aop8 = document.getElementById(op8);
let op9 = "e1n1" + i;
var aop9 = document.getElementById(op9);
let op10 = "e1n2" + i;
var aop10 = document.getElementById(op10);
let op11 = "e1n3" + i;
var aop11 = document.getElementById(op11);
let op12 = "F1T" + i;
var aop12 = document.getElementById(op12);

let Valor0=  aop0.innerHTML;
let Valor1=  aop1.innerHTML;
let Valor2=  aop2.innerHTML;
let Valor3=  aop3.innerHTML;
let Valor4=  aop4.innerHTML;
let Valor5=  aop5.innerHTML;
let Valor6=  aop6.innerHTML;
let Valor7=  aop7.innerHTML;
let Valor8=  aop8.innerHTML;
let Valor9=  aop9.innerHTML;
let Valor10=  aop10.innerHTML;
let Valor11=  aop11.innerHTML;
let Valor12=  aop12.innerHTML;

let valores = [Valor0, Valor1, Valor2, Valor3, Valor4, Valor5, Valor6, Valor7, Valor8, Valor9, Valor10, Valor11, Valor12];

let resultados = [];

for (let i = 0; i < valores.length; i++) {
  if (valores[i] === "Si") {
    resultados[i] = 1;
  } else if (valores[i] === "No") {
    resultados[i] = 0;
  } else {
    resultados[i] = valores[i];
  }
}

let resultadosString = resultados.join("");
console.log(resultadosString);



objeto = {

    "string" : resultadosString,
    "correo":correo,

    }
    
    
    fetch("/notificaremplazos", {
       method:"POST",
       headers: {"Content-type":"application/json"},
       body: JSON.stringify(objeto),})
       .then(res => res.json())
       .then(json =>  {
                                      }) 
                                      var loc = window.location;
                                      loc.reload();
    
    

}

function solicitarRegistro(i) {

    var correo2 = document.getElementById(i);
    let correo = correo2.innerHTML;

    objeto = {

       
        "correo":correo,
    
        }


    fetch("/solictarcambiodepss", {
        method:"POST",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify(objeto),})
        .then(res => res.json())
        .then(json =>  {  if(json == true){ window.location.href = "notificaciones"; }
                                       }) 
                                      

}


  




function refrescar () {
var loc = window.location;
loc.reload(); }
