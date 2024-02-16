

    let currentUrl = window.location.href;
let value = currentUrl.match(/p\/([^\/]+)/)[1];


objeto =   { "tck" : value    }


fetch("/publicticket", {
    method:"POST",
    headers: { 
       "Content-type": "application/json",
    },
 body: JSON.stringify( objeto )})
 .then(res => res.json())
 .then(json =>   { 

   i=0;
   
   let reversa = json;

   console.log(reversa)


        

      const colum = document.getElementById(`colum`)
      const colume = document.createElement("div")
      colume.setAttribute(`class` , `deleTotal` )
      colume.setAttribute(`id` , `colum${i}` )
      colum.appendChild(colume)

      const btn = document.getElementById(`colum${i}`)
      const btne = document.createElement("button")
      btne.setAttribute(`class` , `btn` )
      btne.setAttribute(`id` , `tik${i}d` )
      btne.setAttribute(`style` , `display:none`)
      btne.setAttribute(`onclick` , `borrar( '${i}' )` );
      btne.textContent = "";
      btn.appendChild(btne)
      
      const stock = document.getElementById(`colum${i}`)
      const stock1 = document.createElement("i")
      stock1.setAttribute(`class` , `fas fa-dollar-sign` )
      stock1.setAttribute(`style` , `display:none !important`)
      stock1.setAttribute(`id` , `tik${i}pub` )
      stock1.setAttribute(`onclick` , `stock('${reversa.ntiket}')` );
      stock1.textContent = "";
      stock.appendChild(stock1)
      


      const btn1 = document.getElementById(`colum${i}`)
      const btne1 = document.createElement("i")
      btne1.setAttribute(`class` , `fas fa-globe` )
      btne1.setAttribute(`style` , `display:none !important`)
      btne1.setAttribute(`id` , `tik${i}pub` )
      btne1.setAttribute(`onclick` , `publico( '${i}' )` );
      btne1.textContent = "";
      btn1.appendChild(btne1)


      const asuntoa = document.getElementById(`colum${i}`)
      const asuntoea = document.createElement("img")
      asuntoea.setAttribute(`class` , `estadoimg` )
      asuntoea.setAttribute(`id` , `tik${i}img` )
      asuntoa.appendChild(asuntoea)
      img(i,reversa.estado)


      const tiketsr = document.getElementById(`colum${i}`)
      const tiketser = document.createElement("p")
      tiketser.setAttribute(`class` , `numerotikk` )
      tiketser.textContent = "N° de Ticket  :  ";
      tiketsr.appendChild(tiketser)

   
      
      const tikets = document.getElementById(`colum${i}`)
      const tiketse = document.createElement("h1")
      tiketse.setAttribute(`class` , `tikk` )
      tiketse.setAttribute(`id` , `tik${i}` )
      tiketse.textContent = reversa.ntiket.toUpperCase();
      tikets.appendChild(tiketse)

      const tiketsru1 = document.getElementById(`colum${i}`)
      const tiketseru1 = document.createElement("p")
      tiketseru1.setAttribute(`class` , `empresaclass` )
      tiketseru1.textContent = "Empresa  :  ";
      tiketsru1.appendChild(tiketseru1)

      const Nombre1 = document.getElementById(`colum${i}`)
      const NombreE1 = document.createElement("h1")
      NombreE1.setAttribute(`id` , `tik${i}dn` )
      NombreE1.setAttribute(`class` , `empresa empresaclass1` )
      NombreE1.textContent = reversa.empresa.toUpperCase();
      Nombre1.appendChild(NombreE1)


     

  

      const tiketsru = document.getElementById(`colum${i}`)
      const tiketseru = document.createElement("p")
      tiketseru.setAttribute(`class` , `nomape` )
      tiketseru.textContent = "Nombre Del Usuario  :  ";
      tiketsru.appendChild(tiketseru)


      const Nombre = document.getElementById(`colum${i}`)
      const NombreE = document.createElement("h1")
      NombreE.setAttribute(`class` , `nomape1` )
      NombreE.setAttribute(`id` , `tik${i}dn` )
      NombreE.textContent = reversa.nomape;
      Nombre.appendChild(NombreE)

      const tiketsru3 = document.getElementById(`colum${i}`)
      const tiketseru3 = document.createElement("p")
      tiketseru3.textContent = "Fecha  :  ";
      tiketseru3.setAttribute(`class` , `fecha1` )
      tiketsru3.appendChild(tiketseru3)

      const fecha = document.getElementById(`colum${i}`)
      const fechae = document.createElement("h1")
      fechae.setAttribute(`id` , `tik${i}fe`)
      fechae.setAttribute(`class` , `fecha1` )
      fechae.textContent = reversa.Fecha;
      fecha.appendChild(fechae)


   

      const tiketsru2 = document.getElementById(`colum${i}`)
      const tiketseru2 = document.createElement("p")
      tiketseru2.textContent = "ASUNTO  :  ";
      tiketseru2.setAttribute(`class` , `asunto` )
      tiketsru2.appendChild(tiketseru2)

      const asunto = document.getElementById(`colum${i}`)
      const asuntoe = document.createElement("h1")
      asuntoe.setAttribute(`class` , `asunto1` )
      asuntoe.textContent = reversa.asunto;
      asunto.appendChild(asuntoe)

      

    
    



      const btnd = document.getElementById(`colum${i}`)
      const btnde = document.createElement("button")
      btnde.setAttribute(`class` , `btn2 masbtn` )
      btnde.setAttribute(`id` , `tik${i}des` )
      btnde.setAttribute(`onclick` , `mas( '${i}' )` );
      btnde.textContent = "";
      btnd.appendChild(btnde)

      const btnda = document.getElementById(`colum${i}`)
      const btndea = document.createElement("button")
      btndea.setAttribute(`class` , `btnimg` )
      btndea.setAttribute(`id` , `tik${i}desaa` )
      btndea.setAttribute(`onclick` , `descarga( '${i}' )` );
      btndea.textContent = "Descargar Archivo Adjunto";
      btnda.appendChild(btndea)


      if(reversa.captura == "") {
         
       
         document.getElementById(`tik${i}desaa`).style.display = "none";
   
   
   } 

      

      const btndn = document.getElementById(`colum${i}`)
      const btnden = document.createElement("button")
      btnden.setAttribute(`class` , `btnM` )
      btnden.setAttribute(`id` , `tik${i}desM` )
      btnden.setAttribute(`style` , `display:none`)
      btnden.setAttribute(`onclick` , `menos( '${i}' )` );
      btnden.textContent = "";
      btndn.appendChild(btnden)

      const opciond = document.getElementById(`colum${i}`)
      const opcioned = document.createElement("h3")
      opcioned.setAttribute(`id` , `tik${i}dessed`)
      opcioned.setAttribute(`class` , `tikd`)
      opcioned.setAttribute(`style` , `display:none`)
      opcioned.textContent = "Detalle del Ticket";
      opciond.appendChild(opcioned);
      
      const descripcion = document.getElementById(`colum${i}`)
      const descripcione = document.createElement("h5")
      descripcione.setAttribute(`id` , `tik${i}desc`)
      descripcione.setAttribute(`class` , `tikd`)
      descripcione.setAttribute(`style` , `display:none`)
      descripcione.textContent = reversa.descripcion;
      descripcion.appendChild(descripcione);

      ///////////////////////////////////////
      

      const opcionda = document.getElementById(`colum${i}`)
      const opcioneda = document.createElement("h3")
      opcioneda.setAttribute(`id` , `tik${i}sop`)
      opcioneda.setAttribute(`class` , `tikd`)
      opcioneda.setAttribute(`style` , `display:none`)
      opcioneda.textContent = "Detalle de Soporte";
      opcionda.appendChild(opcioneda);

      const descripciona = document.getElementById(`colum${i}`)
      const descripcionea = document.createElement("nav")
      descripcionea.setAttribute(`id` , `tik${i}sop2`)
      descripcionea.setAttribute(`class` , `tikd`)
      descripcionea.setAttribute(`style` , `display:none`)
      descripciona.appendChild(descripcionea);


      function verificarVariable(variable) {
         if (variable === null || variable === undefined || variable === '') {
           return false;
         } else {
           return true;
         }
       }

if (verificarVariable(reversa.nota) == true ) { Hilo(i)} 


   function Hilo (i) {  


      let cadena = reversa.nota;


      var arregloTexto = cadena.replace(/\[|\]/g, '');
      var arreglo = arregloTexto.split(',');
      for(a=0; a< arreglo.length; a++ ){

      

      const descripcionaP = document.getElementById(`tik${i}sop2`)
      const descripcioneaP = document.createElement("p")
      descripcioneaP.setAttribute(`class` , `${getInfo(a)}`)
      descripcioneaP.setAttribute(`style` , `${display(a)}`)
      descripcioneaP.setAttribute(`id` ,  `${identificador(a)}` )
      descripcioneaP.setAttribute(`onclick` , `mashilo( '${i}', '${a}' )` );
      descripcioneaP.textContent =  getInfo2(a);
      descripcionaP.appendChild(descripcioneaP);


    function getInfo(numero) {
  if (typeof numero !== 'number') {
    throw new Error('El valor proporcionado no es un número.');
  }

  return numero % 2 === 0 ? 'infoThilo btn-76' : 'infoPhilo';
}

function getInfo2(numero) {

     fechaTiempo(arreglo[a])

   if (typeof numero !== 'number') {
     throw new Error('El valor proporcionado no es un número.');
   }
 
   return numero % 2 === 0 ? fechaTiempo(arreglo[a]).toUpperCase() : arreglo[a];
 }


            function fechaTiempo(cadena) {  
              
                  const regex = /\d{2}-\d{2}-\d{4}/; // Expresión regular para buscar cualquier patrón de fecha dd-mm-yyyy
                  const match = cadena.match(regex);
              
                  if (match && match.length > 0) {
                     console.log(match[0])

                     var fechaProporcionada = match[0];

// Convertir la fecha proporcionada en un objeto Date
var partesFecha = fechaProporcionada.split("-");
var fechaObjProporcionada = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);

// Obtener la fecha de hoy
var fechaHoy = new Date();

// Calcular la diferencia en milisegundos
var diferenciaMilisegundos = fechaObjProporcionada - fechaHoy;

// Convertir la diferencia de milisegundos a días
var diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

if (Math.abs(diferenciaDias) > 30) {
   return cadena;
 } else {
   return " Hace " + Math.abs(diferenciaDias) + " Dias " + cadena;
 } } else {
                      return cadena; // Si no se encuentra una fecha en el formato esperado
                  }
              }
            

 function display(numero) {

   
   if (typeof numero !== 'number') {
     throw new Error('El valor proporcionado no es un número.');
   }
 
   return numero % 2 === 0 ? "display:inline-block" : "display:none";
 }

 function identificador(numero) {
   if (typeof numero !== 'number') {
     throw new Error('El valor proporcionado no es un número.');
   }
 
   return numero % 2 === 0 ? "SinID" : "hilo"+ i + a + "mas";
 }


   
   
   }
   
   

     

      ////////////////////////////////////////

    

      const descripcionaf = document.getElementById(`colum${i}`)
      const descripcioneaf = document.createElement("h5")
      descripcioneaf.setAttribute(`id` , `tik${i}dta2`)
      descripcioneaf.setAttribute(`class` , `tikd1`)
      descripcioneaf.setAttribute(`style` , `display:none`)
      descripcioneaf.textContent = reversa.facturacion2;
      descripcionaf.appendChild(descripcioneaf);



 



      /////////////////////////////////////////

      const opciond1 = document.getElementById(`colum${i}`)
      const opcioned1 = document.createElement("h2")
      opcioned1.setAttribute(`id` , `tik${i}dessed2`)
      opcioned1.setAttribute(`class` , `tikd`)
      opcioned1.setAttribute(`style` , `display:none`)
      opcioned1.textContent = "Actualizar Informacion del Ticket";
      opciond1.appendChild(opcioned1);
      

      const caso = document.getElementById(`colum${i}`)
      const casoe = document.createElement("textarea")
      casoe.setAttribute(`id` , `tik${i}descin`)
      casoe.setAttribute(`class` , `tikd`)
      casoe.setAttribute(`type` , `text`)
      casoe.setAttribute(`style` , `display:none`)
      caso.appendChild(casoe);

      
      
    


      const opcion = document.getElementById(`colum${i}`)
      const opcione = document.createElement("select")
      opcione.setAttribute(`id` , `tik${i}desse`)
      opcione.setAttribute(`class` , `tikd`)
      opcione.setAttribute(`style` , `display:none`)
      opcione.textContent = reversa.descripcion;
      opcion.appendChild(opcione);

      //////Facturacion







  



         ////////////////


   

      
      
      
      } 
 
 })


     
         
      
   

function menos(i) {  

let id = "tik"+ i + "desc";
let id2 = "tik"+ i + "descin";
let id3 = "tik"+ i + "desse";
let id4 = "tik"+ i + "envi";
let id5 = "tik"+ i + "dessed";
let id6 = "tik"+ i + "dessed2";
let id7 = "tik"+ i + "des";
let id8 = "tik"+ i + "desM";
let id9 = "tik"+ i + "sop";
let id10 = "tik"+ i + "sop2";
let id11 = "factu"+i+"ti";
let id12 = "factu"+i+"desc";
let id13 = "factu"+i+"ch";
let id14 = "tik" + i + "dta2";
let id15 = "tik" + i + "dta";
let id16 = "presupuestar" + i;
let id17 = "1funcion" + i;
let id18 = "2funcion" + i;





document.getElementById(id).style.display  = "none";
document.getElementById(id2).style.display = "none";
document.getElementById(id3).style.display = "none";

document.getElementById(id5).style.display = "none";
document.getElementById(id6).style.display = "none";
document.getElementById(id7).style.display = "block";
document.getElementById(id8).style.display = "none";
document.getElementById(id9).style.display = "none";
document.getElementById(id10).style.display = "none";

document.getElementById(id12).style.display = "none";
document.getElementById(id13).style.display = "none";
document.getElementById(id14).style.display = "none";
document.getElementById(id15).style.display = "none";
document.getElementById(id16).style.display = "none";
document.getElementById(id17).style.display = "none";
document.getElementById(id18).style.display = "none";




}


 
function  mas(i) {
  


let id = "tik"+ i + "desc";
let id2 = "tik"+ i + "descin";
let id3 = "tik"+ i + "desse";
let id4 = "tik"+ i + "envi";
let id5 = "tik"+ i + "dessed";
let id6 = "tik"+ i + "dessed2";
let id7 = "tik"+ i + "desM";
let id8 = "tik"+ i + "des";
let id9 = "tik"+ i + "sop";
let id10 = "tik"+ i + "sop2";
let id11 = "factu"+i+"ti";
let id12 = "factu"+i+"desc";
let id13 = "factu"+i+"ch";
let id14 = "tik" + i + "dta2"
let id15 = "tik" + i + "dta"
let id16 = "presupuestar" + i;
let id17 = "1funcion" + i;
let id18 = "2funcion" + i;

document.getElementById(id).style.display  = "block";
document.getElementById(id5).style.display = "block";
document.getElementById(id7).style.display = "block";
document.getElementById(id8).style.display = "none";
document.getElementById(id9).style.display = "block";
document.getElementById(id10).style.display = "block";
document.getElementById(id12).style.display = "block";
document.getElementById(id14).style.display = "block";
document.getElementById(id13).style.display = "inline-block";
document.getElementById(id16).style.display = "inline-block";
document.getElementById(id17).style.display = "inline-block";
document.getElementById(id18).style.display = "inline-block";




      const empresa21 = document.getElementById(id3)
      const empresae21 = document.createElement("option")
      empresae21.textContent = "Estado";
      empresa21.appendChild(empresae21);

      const empresa = document.getElementById(id3)
      const empresae = document.createElement("option")
      empresae.textContent = "En Proceso";
      empresa.appendChild(empresae);

      const empresa3 = document.getElementById(id3)
      const empresae3 = document.createElement("option")
      empresae3.textContent = "Aguardando";
      empresa3.appendChild(empresae3);

      const empresa2 = document.getElementById(id3)
      const empresae2 = document.createElement("option")
      empresae2.textContent = "Finalizado";
      empresa2.appendChild(empresae2);

 
   
      
    

}


function enviar(i){

   let facturar = "factu"+ i + "ch";

   let facturar1 = document.getElementById(facturar).checked; 
  
   

if (  facturar1 == true   && history0.facturacion1 == "false") {
  let respuesta = confirm("El ticket ya fue enviado a facturar esta seguro que desea enviarlo nuevoamente?")
  if (respuesta == true) { enviar1(i) } else { console.log("El usuario rechazo el envio")}
} else { 
   enviar1(i)

}

}

  
function enviar1(i) {

   var presupuestar = "presupuestar" + i;
   var tiket = "tik" + i; 
   var select ="tik"+ i+ "desse";
   var actual = "tik" +i + "descin";
   let facturardes = "factu"+i+"desc";  
   let facturar = "factu"+i + "ch";
   let tiket2 = document.getElementById(tiket).innerHTML; 
   let select2 = document.getElementById(select).value; 
   let actual3 = document.getElementById(actual).value;
   var actual2 = actual3.replace(/,/g, '');
   let descripcionfactu = document.getElementById(facturardes).value; 
   let facturar1 = document.getElementById(facturar).checked;
   let presupuestar1 = document.getElementById(presupuestar).checked; 


console.log(presupuestar1)

   tiketfinal = {

"tiket" : tiket2,
"select" : select2,
"actual" : actual2,
"facturardes" : descripcionfactu,
"facturar" : facturar1,
"presupuetar": presupuestar1
}


fetch("/uptiket", {
   method:"POST",
   headers: {"Content-type":"application/json"},
   body: JSON.stringify(tiketfinal),})
   .then(res => res.json())
   .then(json =>  { 
                if (json == true) {  window.location.href = "historialg";    } else if (json == false) {alert("No se detectaron cambios porfavor verifique su respuesta")}
                                  }) 



}

function  borrar(i) {
if (confirm("¿Estás seguro de que deseas eliminar el Ticket?")) {
   borrarok(i)
 } else {
   console.log("cancelado")
 } 

}



function  borrarok(i) {
   id = "tik" + i;
   console.log(id)
  var demo = document.getElementById(id);
  document.getElementById(id).style.background = "red";

tiket  =  demo.innerHTML 
console.log(tiket)
objeto =   { "tiket" : tiket    }

fetch("/delet", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   { 
    
   if (json == true) {  window.location.href = "historialg";    } else if (json == false) {alert("No se detectaron cambios porfavor verifique su respuesta")}

}



)}
        


   function descarga(i) {

      console.log("ejecutando descarga")

     

      const h1 = document.getElementById("tik"+i);
      h1r = h1.innerHTML
      const imagen = "IM" + h1r + ".jpg";
      
    
      console.log(imagen)
      objeto =   { "imagen" : imagen  }
   
      fetch("/descargaimg", {
         method:"POST",
         headers: { 
            "Content-type": "application/json",
         },
      body: JSON.stringify( objeto )})
      .then(res => res.blob())
      .then(blob => {

         const imageUrl = URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = imageUrl;
         link.download = "CampuraDelUsuario.jpg";
         link.click();
         // limpia la url temporal
         URL.revokeObjectURL(imageUrl);


      
      
         }   )}



   function publico(i) {

      var respuesta = confirm("¿Está seguro que desea hacer publico este ticket? asegurese de que el mismo no contenga informacion privada. Si desea que el ticket vuelva a ser privado contacte con el administrador del sitio");

      
if (respuesta == true){
      id = "tik" + i;
      console.log(id)
     var demo = document.getElementById(id);
     document.getElementById(id).style.background = "blue";
   
   tiket  =  demo.innerHTML 
   console.log(tiket)
   objeto =   { "tiket" : tiket    }
   
   fetch("/tckpub", {
      method:"POST",
      headers: { 
         "Content-type": "application/json",
      },
   body: JSON.stringify( objeto )})
   .then(res => res.json())
   .then(json =>   {  
   
      if (json == true) {
         
         console.log("resivido true")
         window.location.href = "/p/" + tiket;    }
   
   
      }   )
      




   } else {console.log("Cancelado")} }
 
 
                            



   function deleTotal () {
      const elements = document.getElementsByClassName("deleTotal");

      while (elements.length > 0) {
         elements[0].remove();
       }

   }



   function Ultomos20 (){


     
let miObjeto = history.reverse();
// Obtenemos las claves del objeto
let clavesObjeto = Object.keys(miObjeto);

// Comprobamos si el número de claves es mayor a 20
if (clavesObjeto.length > 20) {
  // Usamos un bucle for para eliminar las claves que están después de la posición 20
  for (let i = 20; i < clavesObjeto.length; i++) {
    delete miObjeto[clavesObjeto];
  }
}

// Creamos un nuevo objeto con las claves y valores actualizados
let nuevoObjeto = {};
for (let i = 0; i < clavesObjeto.length; i++) {
  if (miObjeto.hasOwnProperty(clavesObjeto)) {
    nuevoObjeto[clavesObjeto] = miObjeto[clavesObjeto];
  }
}

reversa(nuevoObjeto) 
    
   }

   function reversa(rev) {
    
 
       
       let Devuelvo= Object.values(rev).reverse();
     
     historial(Devuelvo)

   }



   function BuscarEstado() {
      var input = document.getElementById("empresaselec").value;
      console.log(input)
  
         
         let parametroEnviar=[];
         let z=0;

          new Promise((resolve, reject) => {
               for(i=0; i< history0.length; i++ ){
                  const indice = history0.estado.indexOf(input);
                  if (indice !== -1 ) { 
                     parametroEnviar[z]= history0;
                     z++;
                  }
               }
               resolve(parametroEnviar);
            }).then((parametroEnviar) => {
               historial(parametroEnviar);
            });
         }
      


         function img (id,estado){


            if (estado == "finalizado"){

 const idestado = document.getElementById("tik" + i + "img");
 idestado.setAttribute(`src` , `icon/finalizado.png`) 

} else if (estado == "en proceso"){
   const idestado = document.getElementById("tik" + i + "img");
   idestado.setAttribute(`src` , `icon/en proceso.png`) 

}else if (estado == "aguardando"){
   const idestado = document.getElementById("tik" + i + "img");
   idestado.setAttribute(`src` , `icon/aguardando.png`) 

}



         }




         function stock(i) {

            
             
  let url = "http://localhost:4000/stock/" + i; // Aquí puedes cambiar la URL según lo desees
  let ventanaEmergente = window.open(url, "_blank", "width=700,height=300");
             
          
         }
   


         function mashilo(i,a) {

               let amas = parseInt(a) + 1;

           let id =  "hilo" + i + amas + "mas";

           
           const element = document.getElementById(id);
        
            if (element) {
                if (element.style.display === 'none') {
                    element.style.display = 'inline-block';
                } else if (element.style.display === 'inline-block') {
                    element.style.display = 'none';
                } else {
                    // Si el estilo display no está definido en línea, asumimos que está en la hoja de estilos
                    // y aplicamos el estilo contrario.
                    element.style.display = 'inline-block';
                }
            }
        }
        
