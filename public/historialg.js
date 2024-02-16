let sitioactual = "https://www.soporte.intervia.com.ar";

var TicketSeleccionadoParaEnvio ;
var TicketSeleccionadoParaEnvio2 ;
var ListaDeCorreosListoParaEnvio = [];
var ListaDeCorreosListoParaEnvio2 = [];

var listaStockTotal = []


let history;
let history0;
let historialGuardado;


////////////////// Filtro busacador

setTimeout(selectChanged, 500); // establecer la busqueda en 50
function selectChanged() {
   var selectBox = document.getElementById('amounts');
   var selectedValue = selectBox.options[selectBox.selectedIndex].value;
 
   history = historialGuardado;
   history0 = historialGuardado;

   if(selectedValue == 50) {
history = history.slice(-50);
history0 = history.slice(-50);
   } else if (selectedValue == 200) {
      history = history.slice(-200);
      history0 = history.slice(-200);
         } else if (selectedValue == 500) {
            history = history.slice(-500);
            history0 = history.slice(-500);
               }


 }




//////////////////////////

fetch("/solicitudstock", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
  
})
.then(res => res.json())
.then(json =>  {  

    listaStockTotal = json;

 
 })

fetch("/historialgl", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
  
})
.then(res => res.json())
.then(json =>  {   const transformToLower = (obj) => {
   for (let prop in obj) {
     if (typeof obj[prop] === 'string') {
       obj[prop] = obj[prop].toLowerCase();
     } else if (typeof obj[prop] === 'object') {
       transformToLower(obj[prop]);
     }
   }
 }


 transformToLower(json);
   
   
   history = json;
   historialGuardado = json;
   



 
 })










 fetch("/historialgl", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
  
})
.then(res => res.json())
.then(json =>  {   const transformToLower = (obj) => {
   for (let prop in obj) {
     if (typeof obj[prop] === 'string') {
       obj[prop] = obj[prop].toLowerCase();
     } else if (typeof obj[prop] === 'object') {
       transformToLower(obj[prop]);
     }
   }
 }


 transformToLower(json);
   
   

   history0 = json;


 
 })





 document.addEventListener("DOMContentLoaded", function() {
   var input = document.getElementById("buscador");
   input.addEventListener("input", BuscarPropiedad);
   let buscador = document.getElementById("buscador").value; 


   function BuscarPropiedad() {
      if (buscador.value == "") {
    
      } else {
         
         let parametroEnviar=[];
         let z=0;

         var input = document.getElementById("buscador");

         if(buscador.value == "") {
            deleTotal();
         } else {
            return new Promise((resolve, reject) => {
               for(i=0; i< history0.length; i++ ){
                  const indice = history0[i].correo.indexOf(input.value);
                  const indice2 = history0[i].nomape.indexOf(input.value);
                  const indice3 = history0[i].ntiket.indexOf(input.value);
                  const indice4 = history0[i].descripcion.indexOf(input.value);
                  const indice5 = history0[i].asunto.indexOf(input.value);
                  
                  if (indice !== -1 || indice2 !== -1 || indice3 !== -1 || indice4 !== -1 || indice5 !== -1 ) { 
                     parametroEnviar[z]= history0[i];
                     z++;
                  }
               }
               resolve(parametroEnviar);
            }).then((parametroEnviar) => {
               historial(parametroEnviar);
            });
         }
      }
   }
});



             


 
function historial(json) { 

deleTotal()



let reversa = Object.values(json).reverse();

   
   
      for(i=0; i< reversa.length; i++ ){

        

      const colum = document.getElementById(`colum`)
      const colume = document.createElement("div")
      colume.setAttribute(`class` , `deleTotal` )
      colume.setAttribute(`id` , `colum${i}` )
      colum.appendChild(colume)

      const btn = document.getElementById(`colum${i}`)
      const btne = document.createElement("img")
      btne.setAttribute(`class` , `minicon` )
      btne.setAttribute(`src` , `icon/basura.png` )
      btne.setAttribute(`title` , `Eliminar` )
      btne.setAttribute(`id` , `tik${i}d` )
      btne.setAttribute(`onclick` , `borrar( '${i}' )` );
      btne.textContent = "";
      btn.appendChild(btne)
      

     if (reversa[i].calificado == "true"){  

      const metricas = document.getElementById(`colum${i}`)
      const metricasa = document.createElement("img")
      metricasa.setAttribute(`class` , `minicon` )
      metricasa.setAttribute(`id` , `tik${i}pub` )
      metricasa.setAttribute(`title` , `CALIFICADO!!` )
      metricasa.setAttribute(`src` , `icon/listo.png` )
      metricasa.textContent = "";
      metricas.appendChild(metricasa)

   
   } else {

      
      const metricas = document.getElementById(`colum${i}`)
      const metricasa = document.createElement("img")
      metricasa.setAttribute(`class` , `minicon` )
      metricasa.setAttribute(`id` , `tik${i}pub` )
      metricasa.setAttribute(`title` , `Calificar Ticket` )
      metricasa.setAttribute(`src` , `icon/star.png` )
      metricasa.setAttribute(`onclick` , `puntuar('${reversa[i].ntiket}')` );
      metricasa.textContent = "";
      metricas.appendChild(metricasa)
      
   }

      
      const stock = document.getElementById(`colum${i}`)
      const stock1 = document.createElement("img")
      stock1.setAttribute(`class` , `minicon`)
      stock1.setAttribute(`id` , `tik${i}pub` )
      stock1.setAttribute(`title` , `${buscarItemsPorCodigoEntregado(reversa[i].ntiket)}` )
      stock1.setAttribute(`src` , `icon/stock.png` )
      stock1.setAttribute(`onclick` , `stock('${reversa[i].ntiket}')` );
      stock1.textContent = "";
      stock.appendChild(stock1)
      


      const btn1 = document.getElementById(`colum${i}`)
      const btne1 = document.createElement("img")
      btne1.setAttribute(`class` , `minicon` )
      btne1.setAttribute(`id` , `tik${i}pub` )
      btne1.setAttribute(`title` , `Aplicar Ticket Publico` )
      btne1.setAttribute(`src` , `icon/mundo.png` )
      btne1.setAttribute(`onclick` , `publico( '${i}' )` );
      btne1.textContent = "";
      btn1.appendChild(btne1)

      const asuntoa1 = document.getElementById(`colum${i}`)
      const asuntoea1 = document.createElement("img")
      asuntoea1 .setAttribute(`src` , `icon/subir.png` )
      asuntoea1.setAttribute(`class` , `estadoimg` )
      asuntoea1.setAttribute(`onclick` , `imagen( '${reversa[i].ntiket}' )` );
      asuntoea1.setAttribute(`id` , `activarImagen` )
      asuntoa1.appendChild(asuntoea1)

      const tiketsen = document.getElementById(`colum${i}`)
      const tiketseen = document.createElement("img")
      tiketseen.setAttribute(`class` , `minicon1` )
      tiketseen.setAttribute(`id` , `tik${i}correo` ) 
      tiketseen.setAttribute(`src` , `icon/CorreoEnvio.png`) 
      tiketseen.setAttribute(`onclick` , `abrirEmail('${reversa[i].ntiket}')` )
      tiketsen.appendChild(tiketseen)


      const tiketsen2 = document.getElementById(`colum${i}`)
      const tiketseen2 = document.createElement("img")
      tiketseen2.setAttribute(`class` , `minicon1` )
      tiketseen2.setAttribute(`id` , `tik${i}correo` ) 
      tiketseen2.setAttribute(`src` , `icon/recordatorio.png`) 
      tiketseen2.setAttribute(`onclick` , `abrirEmail2('${reversa[i].ntiket}')` )
      tiketsen2.appendChild(tiketseen2)


      const asuntoa = document.getElementById(`colum${i}`)
      const asuntoea = document.createElement("img")
      asuntoea.setAttribute(`class` , `estadoimg` )
      asuntoea.setAttribute(`id` , `tik${i}img` )
      asuntoa.appendChild(asuntoea)
      img(i,reversa[i].estado)


   


      const tiketsr = document.getElementById(`colum${i}`)
      const tiketser = document.createElement("p")
      tiketser.setAttribute(`class` , `numerotikk` )
      tiketser.textContent = "Ticket  :  ";
      tiketsr.appendChild(tiketser)

   
      
      const tikets = document.getElementById(`colum${i}`)
      const tiketse = document.createElement("h1")
      tiketse.setAttribute(`class` , `tikk` )
      tiketse.setAttribute(`id` , `tik${i}` )
      tiketse.setAttribute(`dblclick` , `abrirEmail(${reversa[i].ntiket})` )
      tiketse.textContent = reversa[i].ntiket.toUpperCase();
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
      NombreE1.textContent = reversa[i].empresa.toUpperCase();
      Nombre1.appendChild(NombreE1)


     

  

      const tiketsru = document.getElementById(`colum${i}`)
      const tiketseru = document.createElement("p")
      tiketseru.setAttribute(`class` , `nomape` )
      tiketseru.textContent = "Usuario  :  ";
      tiketsru.appendChild(tiketseru)


      const Nombre = document.getElementById(`colum${i}`)
      const NombreE = document.createElement("h1")
      NombreE.setAttribute(`class` , `nomape1` )
      NombreE.setAttribute(`id` , `tik${i}dn` )
      NombreE.textContent = reversa[i].nomape;
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
      fechae.textContent = reversa[i].Fecha;
      fecha.appendChild(fechae)


      

         



      const tiketsru2 = document.getElementById(`colum${i}`)
      const tiketseru2 = document.createElement("p")
      tiketseru2.textContent = "ASUNTO  :  ";
      tiketseru2.setAttribute(`class` , `asunto` )
      tiketsru2.appendChild(tiketseru2)

      const asunto = document.getElementById(`colum${i}`)
      const asuntoe = document.createElement("h1")
      asuntoe.setAttribute(`class` , `asunto1` )
      asuntoe.textContent = reversa[i].asunto;
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


      if(reversa[i].captura == "") {
         
       
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
      opcioned.setAttribute(`class` , `tikd subtitulo`)
      opcioned.setAttribute(`style` , `display:none`)
      opcioned.textContent = "Detalle del Ticket";
      opciond.appendChild(opcioned);
      
      const descripcion = document.getElementById(`colum${i}`)
      const descripcione = document.createElement("h5")
      descripcione.setAttribute(`id` , `tik${i}desc`)
      descripcione.setAttribute(`class` , `tikd`)
      descripcione.setAttribute(`style` , `display:none`)
      descripcione.textContent = reversa[i].descripcion;
      descripcion.appendChild(descripcione);

      ///////////////////////////////////////
      

      const opcionda = document.getElementById(`colum${i}`)
      const opcioneda = document.createElement("h3")
      opcioneda.setAttribute(`id` , `tik${i}sop`)
      opcioneda.setAttribute(`class` , `tikd subtitulo`)
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

if (verificarVariable(reversa[i].nota) == true ) { Hilo(i)} 


   function Hilo (i) {  


      let cadena = reversa[i].nota;


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
   
   }

     

      ////////////////////////////////////////

      const opciondaf = document.getElementById(`colum${i}`)
      const opcionedaf = document.createElement("h3")
      opcionedaf.setAttribute(`id` , `tik${i}dta`)
      opcionedaf.setAttribute(`class` , `tikd1 subtitulo`)
      opcionedaf.setAttribute(`style` , `display:none`)
      opcionedaf.textContent = "Detalles Internos";
      opciondaf.appendChild(opcionedaf);

      const descripcionaf = document.getElementById(`colum${i}`)
      const descripcioneaf = document.createElement("h5")
      descripcioneaf.setAttribute(`id` , `tik${i}dta2`)
      descripcioneaf.setAttribute(`class` , `tikd1`)
      descripcioneaf.setAttribute(`style` , `display:none`)
      descripcioneaf.textContent = reversa[i].facturacion2;
      descripcionaf.appendChild(descripcioneaf);



 



      /////////////////////////////////////////

      const opciond1 = document.getElementById(`colum${i}`)
      const opcioned1 = document.createElement("h2")
      opcioned1.setAttribute(`id` , `tik${i}dessed2`)
      opcioned1.setAttribute(`class` , `tikd subtitulo`)
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
      opcione.setAttribute(`class` , `SelectEstado`)
      opcione.setAttribute(`style` , `display:none`)
      opcione.textContent = reversa[i].descripcion;
      opcion.appendChild(opcione);

      //////Facturacion

      const facturacion = document.getElementById(`colum${i}`)
      const facturaciona = document.createElement("h1")
      facturaciona.setAttribute(`id` , `factu${i}ti`)
      facturaciona.setAttribute(`class` , `tikd1`)
      facturaciona.setAttribute(`style` , `display:none`)
      facturaciona.textContent = "Detalles de Internos";
      facturacion.appendChild(facturaciona);

      const casoa = document.getElementById(`colum${i}`)
      const casoea = document.createElement("textarea")
      casoea.setAttribute(`id` , `factu${i}desc`)
      casoea.setAttribute(`class` , `tikd`)
      casoea.setAttribute(`type` , `text`)
      casoea.setAttribute(`style` , `display:none`)
      casoa.appendChild(casoea);

      const facturacion1 = document.getElementById(`colum${i}`)
      const facturaciona1 = document.createElement("p")
      facturaciona1.setAttribute(`id` , `1funcion${i}`)
      facturaciona1.setAttribute(`class` , `funcion1`)
      facturaciona1.setAttribute(`style` , `display:none`)
      facturaciona1.textContent = "Facturar";
      facturacion1.appendChild(facturaciona1);


         const factua = document.getElementById(`colum${i}`)
         const factua1 = document.createElement("input")
         factua1.setAttribute(`id` , `factu${i}ch`)
         factua1.setAttribute(`class` , `che`)
         factua1.setAttribute(`type` , `checkbox`)
         factua1.setAttribute(`style` , `display:none`)
         factua.appendChild(factua1);

         const facturacion1a = document.getElementById(`colum${i}`)
         const facturaciona1a = document.createElement("p")
         facturaciona1a.setAttribute(`id` , `2funcion${i}`)
         facturaciona1a.setAttribute(`class` , `funcion`)
         facturaciona1a.setAttribute(`style` , `display:none`)
         facturaciona1a.textContent = "Presupuestar";
         facturacion1a.appendChild(facturaciona1a);



         const presupuestar = document.getElementById(`colum${i}`)
         const presupuestar1 = document.createElement("input")
         presupuestar1.setAttribute(`id` , `presupuestar${i}`)
         presupuestar1.setAttribute(`class` , `che`)
         presupuestar1.setAttribute(`type` , `checkbox`)
         presupuestar1.setAttribute(`style` , `display:none`)
         presupuestar.appendChild( presupuestar1);


         ////////////////


   

         const enviar = document.getElementById(`colum${i}`)
         const enviare = document.createElement("button")
         enviare.setAttribute(`class` , `btn2a` )
         enviare.setAttribute(`style` , `display:none`)
         enviare.setAttribute(`id` , `tik${i}envi` )
         enviare.setAttribute(`onclick` , `enviar( '${i}' )` );
         enviare.textContent = "Enviar";
         enviar.appendChild(enviare)
      
      
      
      } 
         
      
   } 

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
document.getElementById(id4).style.display = "none";
document.getElementById(id5).style.display = "none";
document.getElementById(id6).style.display = "none";
document.getElementById(id7).style.display = "block";
document.getElementById(id8).style.display = "none";
document.getElementById(id9).style.display = "none";
document.getElementById(id10).style.display = "none";
document.getElementById(id11).style.display = "none";
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
document.getElementById(id2).style.display = "block";
document.getElementById(id3).style.display = "block";
document.getElementById(id4).style.display = "inline-block";
document.getElementById(id5).style.display = "block";
document.getElementById(id6).style.display = "block";
document.getElementById(id7).style.display = "block";
document.getElementById(id8).style.display = "none";
document.getElementById(id9).style.display = "block";
document.getElementById(id10).style.display = "block";
document.getElementById(id11).style.display = "block";
document.getElementById(id12).style.display = "block";
document.getElementById(id15).style.display = "block";
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



   enviar1(i)

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
                if (json == true) { 
                  if (select2 == "Finalizado") {  puntuar (tiket2)  }
                  
                  window.location.href = "historialg";    } else if (json == false) {alert("No se detectaron cambios porfavor verifique su respuesta")}
                                  }) 



}

function  borrar(i) {
if (confirm("¿Estás seguro de que deseas eliminar el Ticket?")) {
   borrarok(i)
 } else {

 } 

}



function  borrarok(i) {
   id = "tik" + i;

  var demo = document.getElementById(id);
  document.getElementById(id).style.background = "red";

tiket  =  demo.innerHTML 

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



     

      const h1 = document.getElementById("tik"+i);
      h1r = h1.innerHTML
      const imagen = "IM" + h1r + ".jpg";
      

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
   
     var demo = document.getElementById(id);
     document.getElementById(id).style.background = "blue";
   
   tiket  =  demo.innerHTML 

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
         

         window.location.href = "/p/" + tiket;    }
   
   
      }   )
      




   } else {} }
 
 
                            



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
    delete miObjeto[clavesObjeto[i]];
  }
}

// Creamos un nuevo objeto con las claves y valores actualizados
let nuevoObjeto = {};
for (let i = 0; i < clavesObjeto.length; i++) {
  if (miObjeto.hasOwnProperty(clavesObjeto[i])) {
    nuevoObjeto[clavesObjeto[i]] = miObjeto[clavesObjeto[i]];
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
   
  
         
         let parametroEnviar=[];
         let z=0;

          new Promise((resolve, reject) => {
               for(i=0; i< history0.length; i++ ){
                  const indice = history0[i].estado.indexOf(input);
                  if (indice !== -1 ) { 
                     parametroEnviar[z]= history0[i];
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

            
             
  let url =  sitioactual + "/stock/" + i; // Aquí puedes cambiar la URL según lo desees
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



        function puntuar (ticket) {

         let url = sitioactual + "/puntuacion/" + ticket; // Aquí puedes cambiar la URL según lo desees
         let ventanaEmergente = window.open(url, "_blank", "width=500,height=530");
                    


        }







// Obtener elementos HTML
const inputFile = document.getElementById("fileInput");
const cargarArchivoButton = document.getElementById("cargarArchivo");

// Agregar un evento click al botón para abrir el cuadro de diálogo de selección de archivo
cargarArchivoButton.addEventListener("click", function() {
  inputFile.click();
});



function cargando(){
var cargandoDiv = document.getElementById("cargando");
    
// Mostrar el div de carga
cargandoDiv.style.display = "block";
setTimeout(function() {
   cargandoDiv.style.display = "none";
 }, 2000); // 2000 milisegundos (2 segundos)
}



function imagen(ticket) {

  

   // Obtener el elemento del botón
   const cargarArchivoButton = document.getElementById("cargarArchivo");
 
   // Simular un clic en el botón
   cargarArchivoButton.click();
 
   let alert = confirm("Su imagen esta siendo procesada");
 
   if (alert == true) {

      cargando()
     // Obtén el campo de entrada de tipo archivo
     const fileInput = document.getElementById('fileInput'); // Asegúrate de tener un elemento HTML con el id 'fileInput'
 
     fileInput.addEventListener('change', function () {
       const file = fileInput.files[0]; // Obtén el archivo seleccionado
 
       if (file) {
         // Lee el archivo como un objeto Blob
         const fileReader = new FileReader();
 
         fileReader.onload = function (event) {
           // Aquí, event.target.result contiene los datos binarios del archivo
           const binaryData = event.target.result;
 
           // Convierte los datos binarios a una cadena de caracteres
           let binaryString = '';
           const bytes = new Uint8Array(binaryData);
           bytes.forEach(byte => {
             binaryString += String.fromCharCode(byte);
           });
 
           // Luego, convierte la cadena de caracteres a base64 usando btoa()
           const base64Data = btoa(binaryString);
 
           convertirYDescargarImagen(base64Data, ticket);
         };
 
         // Lee el archivo como un objeto Blob
         fileReader.readAsArrayBuffer(file);
       }
     });
   }
 }
 


 function convertirYDescargarImagen(datosBinarios , ticket) {


   const objetoJSON = {
      ticket: ticket,
      datosBinarios: datosBinarios,
    };
    


    const jsonString = JSON.stringify(objetoJSON);


    fetch('/imagenhistorialg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonString,
    })
      .then(response => response.json())
      .then(data => {
        // Maneja la respuesta del servidor aquí
      })
      .catch(error => {
        console.error('Error al enviar la solicitud POST:', error);
      });
    
 }
 
 var elemento1 = document.getElementById("cargando");
  setTimeout(function() {
   elemento1.style.display = "none";
    }, 2000); // 2000 milisegundos (2 segundos)
  
  





////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////



////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


function cerrarEmail() {
 
   document.getElementById('subject').value = ''; // Vaciar campo de asunto
   document.getElementById('message').value = ''; // Vaciar campo de mensaje

   const overlay = document.querySelector('.overlay');
   overlay.style.display = 'none';

   ListaDeCorreosListoParaEnvio = [];
   mantenerPrimeraEtiquetaP()

}

function mantenerPrimeraEtiquetaP() {
   // Obtén el elemento div con el ID "CorreoListaEnvios"
   const correoListaEnvios = document.getElementById('CorreoListaEnvios');
 
   // Verifica si el elemento existe antes de continuar
   if (correoListaEnvios) {
     // Obtén todas las etiquetas <p> dentro del elemento
     const etiquetasP = correoListaEnvios.querySelectorAll('p');
 
     // Elimina todas las etiquetas <p> excepto la primera
     for (let i = 1; i < etiquetasP.length; i++) {
       correoListaEnvios.removeChild(etiquetasP[i]);
     }
   } else {
   
   }
 }





/////////////////////////////////////////////////////////////   Envio de ticket

let Empresas = [];

 
   fetch("/solicitudemp", {
	
      method:"POST",
      headers: {"Content-type":"application/json"},
        })
         .then(res => res.json())
         .then(json =>  { 

            Empresas = json;
            Listempresas2(json)
            
})




setTimeout(function() {
   Listempresas2(Empresas);
 }, 500);


document.addEventListener("DOMContentLoaded", function() {
   var input = document.getElementById("buscador");
   input.addEventListener("input", miFuncion);
 
   function miFuncion() {

  

      let buscador = document.getElementById("buscador").value; 
   
      if (buscador.value == "") {  } else {

         let parametroEnviar=[];
         let z=0


         function BuscarPropiedad2() {
if(input.value == "") {  }

            return new Promise((resolve, reject) => {
               for(i=0; i< Empresas.length; i++ ){
                  const indice = Empresas[i].empresa.toLowerCase().indexOf(input.value);
                  if (indice !== -1 ) { 
                     
                     parametroEnviar[z]= Empresas[i];
                     z++
                  
                  } 
               
               
              }
          
              resolve(parametroEnviar);
            });
          }
          
      
      
          BuscarPropiedad2().then(() => {
          
            Listempresas2(parametroEnviar); 
          
          });}}
 });

          








function Listempresas2(json) {
console.log("ejecutando empresas")

   removerEmpresas()
                  
            for(i=0; i< json.length; i++ ){
             
               
               const empresa = document.getElementById("empresa")
               const empresae = document.createElement("option")
               empresae.setAttribute(`id` , `tik${i}empresaa` )
               empresae.setAttribute(`class` , `deleTotalEmp` )
               empresae.textContent = json[i].empresa.toUpperCase();
               empresa.appendChild(empresae)

             
           
            
              }

              historial3()
               
}


function removerEmpresas() {
   let elementos = document.querySelectorAll('.deleTotalEmp');
   elementos.forEach(function(elemento) {
       elemento.remove();
   });

}


function removerUsers() {
   let elementos = document.querySelectorAll('.deleTotalUser');
   elementos.forEach(function(elemento) {
       elemento.remove();
   });

}

//////////////////////////////////////////////////////////
const select = document.getElementById("empresa");
select.addEventListener("change", function() { historial3() })



document.addEventListener("DOMContentLoaded", function() {
  
   var input = document.getElementById("buscadorUser");
   input.addEventListener("input", miFuncion);
 
   function miFuncion() {

   
      let buscador = document.getElementById("buscadorUser").value; 
   
      if (buscador.value == "") { console.log("Vacio") } else {
         removeGrupoSoporte();
         let parametroEnviar=[];
         let z=0


         function BuscarPropiedad2() {
if(input.value == "") {  console.log("erro") }

            return new Promise((resolve, reject) => {
               for(i=0; i< BusArrayd.length; i++ ){
                  const indice = BusArrayd[i].empresa.toLowerCase().indexOf(input.value);
                  const indice2 = BusArrayd[i].nombre.toLowerCase().indexOf(input.value);
                  const indice3 = BusArrayd[i].apellido.toLowerCase().indexOf(input.value);
                  const indice4 = BusArrayd[i].correo.toLowerCase().indexOf(input.value);
                  if (indice !== -1 ||indice2  !== -1 ||indice3  !== -1 ||indice4  !== -1 ) { 
                     
                     parametroEnviar[z]= BusArrayd[i];
                     z++
                  
                  } 
               
               
              }
          
              resolve(parametroEnviar);
            });
          }
          
      
      
          BuscarPropiedad2().then(() => {
          
            historial2(parametroEnviar); 
          
          });}}
 });

 BusArrayd = [];


fetch("/buscadordeusuarios", {
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







function historial3() { 

   removerUsers()

   const empresa = document.getElementById("empresa")

            for(i=0; i< BusArrayd.length; i++ ){

               let info = BusArrayd;
            
               if( empresa.value.toUpperCase() == BusArrayd[i].empresa.toUpperCase() ){
                  let imprimir = info[i].nombre +  " (" + info[i].correo +")";
      const empresa = document.getElementById("user")
     const empresae = document.createElement("option")
     empresae.setAttribute(`id` , `tik${i}empresaa` )
     empresae.setAttribute(`alt` , `${info[i].correo}` )
     empresae.setAttribute(`class` , `deleTotalUser` )
     empresae.textContent = imprimir;
     empresa.appendChild(empresae)}

            }



          
          }


          
function historial2(info) { 



   removerUsers()

 
   for(i=0; i< info.length; i++ ){
              

      let imprimir = info[i].nombre +  " (" + info[i].correo +")";
      const empresa = document.getElementById("user")
     const empresae = document.createElement("option")
     empresae.setAttribute(`id` , `tik${i}empresaa` )
     empresae.setAttribute(`alt` , `${info[i].correo}` )
     empresae.setAttribute(`class` , `deleTotalUser` )
     empresae.textContent = imprimir;
     empresa.appendChild(empresae) }

            }



          
          
        
     
            function abrirEmail(a) {
               const miElemento = document.getElementById('EnvioCorreo');
               miElemento.style.display = 'flex';
             
               TicketSeleccionadoParaEnvio = a;
            
             
             }
             
            

             function CorreoListo() {
               // Obtén el elemento select por su ID
               const selectElement = document.getElementById('user');
             
               // Obtiene el elemento option seleccionado
               const selectedOption = selectElement.options[selectElement.selectedIndex];
             
               // Obtiene el valor del atributo 'alt' del option seleccionado
               const altValue = selectedOption.getAttribute('alt');

               insertarParrafoEnCorreoListaEnvios(altValue)



               console.log(ListaDeCorreosListoParaEnvio);
             
             }
             
             // Llama a la función cuando necesites obtener el valor 'alt' seleccionado
           
             function insertarParrafoEnCorreoListaEnvios(contenido) {


             
                  ListaDeCorreosListoParaEnvio.push(contenido);
                
               // Obtén el elemento con el ID "CorreoListaEnvios"
               const correoListaEnvios = document.getElementById('CorreoListaEnvios');
               
               // Verifica si el elemento existe antes de intentar insertar el párrafo
         
                 const parrafo = document.createElement('p');
                 
                 // Asigna el contenido proporcionado como argumento al párrafo
                 parrafo.textContent = contenido;
                 
                 // Inserta el párrafo en el elemento "CorreoListaEnvios"
                 correoListaEnvios.appendChild(parrafo);
           
             }
             


 //////////////////////////  Enviar Correo Copias

 function EnviarCorreoCopias() {

   var contadorP = 0;
   // Obtener los valores de los campos de entrada
   const asunto = document.getElementById('subject').value;
   const mensaje = document.getElementById('message').value;  
    const divCorreo = document.getElementById('CorreoListaEnvios');
   const parrafos = divCorreo.getElementsByTagName('p');
   var elementosHijos = divCorreo.children;

   for (var i = 0; i < elementosHijos.length; i++) {
      if (elementosHijos[i].tagName === "P") {
          contadorP++;
      }}
 
 
   // Verificar si ambos campos están vacíos
   if (asunto.trim() === '' || mensaje.trim() === '') {
     // Al menos uno de los campos está vacío
     alert('Por favor, completa todos los campos.');
   // Detener el envío del formulario
   } else  if (contadorP == 1) {alert("No se indico ningun destino")
    
     } else {EnviarCorreoCopias1 ()}
   }




 
 
  
 
 
 



function EnviarCorreoCopias1 (){

   const inputSubject = document.getElementById('subject');
const valorAsunto = inputSubject.value;
const textareaMessage = document.getElementById('message');
const valorMensaje = textareaMessage.value;


 objeto =   { "tiket" : TicketSeleccionadoParaEnvio,
               "correos": ListaDeCorreosListoParaEnvio,
               "asunto" : valorAsunto,
               "cuerpo" : valorMensaje




}

fetch("/enviodeticketconcopias", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {

if (json == true) {

   cerrarEmail()

   cargando()



}



 }) 





}

function buscarItemsPorCodigoEntregado(codigoEntregado) {
   const itemsEncontrados = listaStockTotal.filter(item => item.entregado === codigoEntregado);

   if (itemsEncontrados.length > 0) {
      let resultadoTotal = "";
      console.log(itemsEncontrados);
      for (var i = 0; i < itemsEncontrados.length; i++) {
         resultadoTotal += itemsEncontrados[i].categoria + " " + itemsEncontrados[i].descripcion + " " +  "\n";
      }
      return resultadoTotal;  // Esto se ha movido fuera del bucle
   } else {
       console.log("Sin stock");
       return "Sin Stock";
   }
}




function removeGrupoSoporte() {
   const select = document.getElementById('user');
   const options = select.options;

   for(let i = 0; i < options.length; i++) {
       if (options[i].getAttribute('alt') === "GrupoSoporte") {
           select.removeChild(options[i]);
           break; // Salir del bucle una vez que se encuentre y se elimine la opción
       }
   }
}

// Llamar a la función para eliminar la opción "Grupo Soporte"
 // 
/////////////////////////////CREAR RECORDATORIO



     
function abrirEmail2(a) {

   const miElemento = document.getElementById('EnvioCorreo2');
   miElemento.style.display = 'flex';
 
   TicketSeleccionadoParaEnvio2 = a;

 
 }
 


 function CorreoListo2() {
   // Obtén el elemento select por su ID
   const selectElement = document.getElementById('user2');
 
   // Obtiene el elemento option seleccionado
   const selectedOption = selectElement.options[selectElement.selectedIndex];
 
   // Obtiene el valor del atributo 'alt' del option seleccionado
   const altValue = selectedOption.getAttribute('alt');

   insertarParrafoEnCorreoListaEnvios2(altValue)



   console.log(ListaDeCorreosListoParaEnvio);
 
 }
 
 // Llama a la función cuando necesites obtener el valor 'alt' seleccionado

 function insertarParrafoEnCorreoListaEnvios2(contenido) {


 
      ListaDeCorreosListoParaEnvio2.push(contenido);
    
   // Obtén el elemento con el ID "CorreoListaEnvios"
   const correoListaEnvios = document.getElementById('CorreoListaEnvios2');
   
   // Verifica si el elemento existe antes de intentar insertar el párrafo

     const parrafo = document.createElement('p');
     
     // Asigna el contenido proporcionado como argumento al párrafo
     parrafo.textContent = contenido;
     
     // Inserta el párrafo en el elemento "CorreoListaEnvios"
     correoListaEnvios.appendChild(parrafo);

 }




 function EnviarCorreoCopias2() {

   var contadorP = 0;
   // Obtener los valores de los campos de entrada
   const asunto = document.getElementById('subject2').value;
   const mensaje = document.getElementById('message2').value;  
    const divCorreo = document.getElementById('CorreoListaEnvios2');
   const parrafos = divCorreo.getElementsByTagName('p');
   var elementosHijos = divCorreo.children;
   var fechaInput = document.getElementById('fechaActivacion');

   function estaFechaSeleccionada() {
      
      return fechaInput.value !== '';
  }
  

   for (var i = 0; i < elementosHijos.length; i++) {
      if (elementosHijos[i].tagName === "P") {
          contadorP++;
      }}
 

      console.log(estaFechaSeleccionada())
 
   // Verificar si ambos campos están vacíos
   if (asunto.trim() === '' || mensaje.trim() === '' || estaFechaSeleccionada() == false )  {
     // Al menos uno de los campos está vacío
     alert('Por favor, completa todos los campos.');
   // Detener el envío del formulario
   } else if (esFinDeSemana(fechaInput.value)) {   alert('No se puede emitir una alerta en dias sabados y domingos.'); } else {EnviarCorreoCopias21 ()}


   function esFinDeSemana(fecha) {

      // Crear un objeto Date a partir de la fecha proporcionada
      var fechaObj = new Date(fecha);
  
      // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
      var diaDeLaSemana = fechaObj.getDay();

      console.log(diaDeLaSemana)
  
      // Verificar si es sábado (6) o domingo (0)
      return diaDeLaSemana === 5 || diaDeLaSemana === 6;
  }



   }


   
function cerrarEmail2() {
 
   document.getElementById('subject2').value = ''; // Vaciar campo de asunto
   document.getElementById('message2').value = ''; // Vaciar campo de mensaje

   const overlay = document.querySelector('.overlay2');
   overlay.style.display = 'none';
   ListaDeCorreosListoParaEnvio2.splice(0, ListaDeCorreosListoParaEnvio2.length);
   mantenerPrimeraEtiquetaP()

}





 function EnviarCorreoCopias21 (){

   const inputSubject = document.getElementById('subject2');
const valorAsunto = inputSubject.value;
const textareaMessage = document.getElementById('message2');
const valorMensaje = textareaMessage.value;
var fechaInput = document.getElementById('fechaActivacion');
const fechaInput2 = fechaInput.value;


 objeto =   { "tiket" : TicketSeleccionadoParaEnvio2,
               "correos": ListaDeCorreosListoParaEnvio2,
               "asunto" : valorAsunto,
               "cuerpo" : valorMensaje,
               "fecha" : fechaInput2




}


fetch("/establecerrecordatorio", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {

if (json == true) {

   cerrarEmail2()

   cargando()



} }) 






}



document.addEventListener("DOMContentLoaded", function() {

   removerUsers2()
  
   var input = document.getElementById("buscadorUser2");
   input.addEventListener("input", miFuncion2);
 
   function miFuncion2() {

      console.log("ejecutando")
   
      let buscador = document.getElementById("buscadorUser2").value; 
   
      if (buscador.value == "") { console.log("Vacio") } else {
         removeGrupoSoporte2();
         let parametroEnviar=[];
         let z=0


         function BuscarPropiedad2() {
if(input.value == "") {  console.log("erro") }

            return new Promise((resolve, reject) => {
               for(i=0; i< BusArrayd.length; i++ ){
                  const indice = BusArrayd[i].empresa.toLowerCase().indexOf(input.value);
                  const indice2 = BusArrayd[i].nombre.toLowerCase().indexOf(input.value);
                  const indice3 = BusArrayd[i].apellido.toLowerCase().indexOf(input.value);
                  const indice4 = BusArrayd[i].correo.toLowerCase().indexOf(input.value);
                  if (indice !== -1 ||indice2  !== -1 ||indice3  !== -1 ||indice4  !== -1 ) { 
                     
                     parametroEnviar[z]= BusArrayd[i];
                     z++
                  
                  } 
               
               
              }
          
              resolve(parametroEnviar);
            });
          }
          
      
      
          BuscarPropiedad2().then(() => {
          
            Listempresas23(parametroEnviar); 
          
          });}}
 });





   function historial32() { 

      removerUsers2()
   
      const empresa = document.getElementById("empresa2")
   
               for(i=0; i< BusArrayd.length; i++ ){
   
                  let info = BusArrayd;
               
                  if( empresa.value.toUpperCase() == BusArrayd[i].empresa.toUpperCase() ){
                     let imprimir = info[i].nombre +  " (" + info[i].correo +")";
         const empresa = document.getElementById("user2")
        const empresae = document.createElement("option")
        empresae.setAttribute(`id` , `tik${i}empresaa` )
        empresae.setAttribute(`alt` , `${info[i].correo}` )
        empresae.setAttribute(`class` , `deleTotalUser2` )
        empresae.textContent = imprimir;
        empresa.appendChild(empresae)}
   
               }
   
   
   
             
             }
   

             function removerUsers2() {

               console.log("Elimionando")

               let elementos = document.querySelectorAll('.deleTotalUser2');
               elementos.forEach(function(elemento) {
                   elemento.remove();
               });
            
            }




            let Empresas2 = [];

 
   fetch("/solicitudemp", {
	
      method:"POST",
      headers: {"Content-type":"application/json"},
        })
         .then(res => res.json())
         .then(json =>  { 

            Empresas2 = json;
            Listempresas23(json)
            
})







 


function Listempresas23(json) {
   
   
      removerEmpresas2()
                     
               for(i=0; i< json.length; i++ ){
                
                  
                  const empresa = document.getElementById("empresa2")
                  const empresae = document.createElement("option")
                  empresae.setAttribute(`id` , `tik${i}empresaa` )
                  empresae.setAttribute(`class` , `deleTotalEmp2` )
                  empresae.textContent = json[i].empresa.toUpperCase();
                  empresa.appendChild(empresae)
   
                
              
               
                 }
   
                 historial32()
                  
   }


   function removerEmpresas2() {
      let elementos = document.querySelectorAll('.deleTotalEmp2');
      elementos.forEach(function(elemento) {
          elemento.remove();
      });
   
   }
   
   



 function removeGrupoSoporte2() {
   const select = document.getElementById('user2');
   const options = select.options;

   for(let i = 0; i < options.length; i++) {
       if (options[i].getAttribute('alt') === "GrupoSoporte") {
           select.removeChild(options[i]);
           break; // Salir del bucle una vez que se encuentre y se elimine la opción
       }
   }
} 











