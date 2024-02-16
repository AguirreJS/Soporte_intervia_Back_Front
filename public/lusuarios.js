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
 
   console.log(json)
   BusArrayd = json
 })
 .catch(error => console.error(error));

let BusArrayd;






let emprelist = [];

 
   fetch("/solicitudemp", {
	
      method:"POST",
      headers: {"Content-type":"application/json"},
        })
         .then(res => res.json())
         .then(json =>  {  emprelist = json})












async function historial() { 

   document.getElementById("buscar1").style.display = "none";

   console.log("ejecutando")
   let empresa1 = document.getElementById("empresa1").value;

    fetch("/listausu", {
        method:"POST",
        headers: { 
           "Content-type": "application/json",
        },
       
     })
     .then(res => res.json())
     .then(async json =>   {

      let reversa = json.reverse();

      

   
      
      for(i=0; i< reversa.length; i++ ){

         let empresa3 = reversa[i].empresa;

         console.log( "la empresa" + empresa3)
         console.log( "comparando " + empresa1)

         if (empresa1 == empresa3){
            console.log("ejecutando script" )

       
     
      const btn = document.getElementById("delete")
      const btne = document.createElement("i")
      btne.setAttribute(`class` , `btn fas fa-trash-alt deleTotal` )
      btne.setAttribute(`id` , `tik${i}d` )
      btne.setAttribute(`onclick` , `borrar( '${i}' )` );
      btne.textContent = "";
      btn.appendChild(btne)


      const ejecutando = document.getElementById("ejecutando")
      const ejecutandoe = document.createElement("i")
      ejecutandoe.setAttribute(`class` , `btn fas fa-check deleTotal` )
      ejecutandoe.setAttribute(`id` , `tik${i}ej` )
      ejecutandoe.setAttribute(`onclick` , `modificar( '${i}' )` );
      ejecutandoe.textContent = "";
      ejecutando.appendChild(ejecutandoe)

      
      
      const correo = document.getElementById("correo")
      const correoe = document.createElement("p")
      correoe.setAttribute(`onclick` , `editarCorreo( '${i}' )` );
      correoe.setAttribute(`class` , `deleTotal` )
      correoe.setAttribute(`id` , `tik${i}co` )
      correoe.textContent = reversa[i].correo;
      correo.appendChild(correoe)

      const nombre = document.getElementById("nombre")
      const nombree = document.createElement("p")
      nombree.setAttribute(`onclick` , `editarNombre( '${i}' )` );
      nombree.setAttribute(`id` , `tik${i}nom` )
      nombree.setAttribute(`class` , `deleTotal` )
      nombree.textContent = reversa[i].nombre;
      nombre.appendChild(nombree)

      const dominio = document.getElementById("dominio")
      const dominioe = document.createElement("select")
      dominioe.setAttribute(`class` , `deleTotal` )
      dominioe.setAttribute(`id` , `tik${i}dom` )
      dominio.appendChild(dominioe)
      


     
        
      
         
         const empresa = document.getElementById("empresa")
         const empresae = document.createElement("p")
         empresae.setAttribute(`id` , `tik${i}em` )
         empresae.setAttribute(`class` , `deleTotal` )
         empresae.textContent = empresa3;
         empresa.appendChild(empresae)
     
   
      const nivelv = document.getElementById("nivel1")
      const nivelev = document.createElement("i")
      nivelev.setAttribute(`class` , `btn fas fa-arrow-up deleTotal` )
      nivelev.setAttribute(`id` , `tik${i}ni` )
      nivelev.setAttribute(`onclick` , `nivel('${i}', true)` );
      nivelev.textContent = "";
      nivelv.appendChild(nivelev)

      const nivelf = document.getElementById("nivel2")
      const nivelef = document.createElement("i")
      nivelef.setAttribute(`class` , `btn fas fa-arrow-down deleTotal` )
      nivelef.setAttribute(`id` , `tik${i}ni` )
      nivelef.setAttribute(`onclick` , `nivel('${i}', false)` );
      nivelef.textContent = "";
      nivelf.appendChild(nivelef)

      
   if ( reversa[i].valid2 == 1 && reversa[i].valid3 == 1 && reversa[i].valid4 == 1 ) { 

      const nivel = document.getElementById("nivel")
      const nivele = document.createElement("p")
      nivele.setAttribute(`class` , `deleTotal` )
      nivele.setAttribute(`id` , `tik${i}niv` )
      nivele.textContent = "Nivel 3";
      nivel.appendChild(nivele)
  
     } else if ( reversa[i].valid2 == 1 && reversa[i].valid3 == 1 && reversa[i].valid4 == 0 ) 
    
     {   const nivel = document.getElementById("nivel")
     const nivele = document.createElement("p")
     nivele.setAttribute(`class` , `deleTotal` )
     nivele.setAttribute(`id` , `tik${i}niv` )
     nivele.textContent = "Nivel 2";
     nivel.appendChild(nivele)     }  else if (reversa[i].valid2 == 1 && reversa[i].valid3 == 0 && reversa[i].valid4 == 0){

      const nivel = document.getElementById("nivel")
      const nivele = document.createElement("p")
      nivele.setAttribute(`class` , `deleTotal` )
      nivele.setAttribute(`id` , `tik${i}niv` )
      nivele.textContent = "Nivel 1";
      nivel.appendChild(nivele)

     }  else if (reversa[i].valid2 == 0 && reversa[i].valid3 == 0 && reversa[i].valid4 == 0){

      const nivel = document.getElementById("nivel")
      const nivele = document.createElement("p")
      nivele.setAttribute(`class` , `deleTotal` )
      nivele.setAttribute(`id` , `tik${i}niv` )
      nivele.textContent = "Nivel 0";
      nivel.appendChild(nivele)

     }  

     
      
    
     

    
   
   } }}
        
     
)  }


function lista (k) {
 
            
             var domi ="tik"+k+"dom";

        

          let    ListaempresaAlfabeto =  ordenarPorEmpresa(emprelist)
            
             for(z=0; z< ListaempresaAlfabeto.length; z++ ){
               
               let empresafinal =ListaempresaAlfabeto[z].empresa;
               const empresa = document.getElementById(domi)
               const empresae = document.createElement("option")
               empresae.setAttribute(`id` , `tik${z}` )
               empresae.textContent = empresafinal;
               empresa.appendChild(empresae)
   
            } 

            function ordenarPorEmpresa(data) {
               return data.sort((a, b) => {
                   if (a.empresa.toLowerCase() < b.empresa.toLowerCase()) return -1;
                   if (a.empresa.toLowerCase() > b.empresa.toLowerCase()) return 1;
                   return 0;
               });
           }


          }





          function  borrar(i) {
            if (confirm("¿Estás seguro de que deseas eliminar el Usuario seleccionado?")) {
               borrarok(i)
             } else {
               console.log("cancelado")
             } 
            
            }

 
function  borrarok(i) {
   id = "tik" + i + "co";
   console.log(id)
  var demo = document.getElementById(id);
  document.getElementById(id).style.background = "red";

correo  =  demo.innerHTML 

objeto =   { "correo" : correo    }

fetch("/deletu", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
body: JSON.stringify( objeto )})
.then(res => res.json())
.then(json =>   {  
   
   if (json == true) { window.location.href = "lusuarios"; } 




   }   )}



   function  nivel( i , pos) {
      id = "tik"+i+"niv";
      correo = "tik"+i+"co";
      post = pos;
     var demo = document.getElementById(id);
     var correo1 = document.getElementById(correo);
     document.getElementById(id).style.background = "red";
   
   nivel2  =  demo.innerHTML ;
   correo2  =  correo1.innerHTML; 
console.log(nivel2)
console.log(correo2)
   
   nivel =   { "correo" : correo2,
                "nivel" : nivel2,
                "up" : post,     }

             
   
   fetch("/uplevel", {
      method:"POST",
      headers: { 
         "Content-type": "application/json",
      },
   body: JSON.stringify( nivel )})
   .then(res => res.json())
   .then(json =>   {  
   
      if (json == true) { window.location.href = "lusuarios"; } 
   
   
      }   )}
   

  

function empresas() {

   


 
   fetch("/solicitudemp", {
	
      method:"POST",
      headers: {"Content-type":"application/json"},
        })
         .then(res => res.json())
         .then(json =>  {

            for(i=0; i< json.length; i++ ){
               
               const empresa = document.getElementById("empresa")
               const empresae = document.createElement("option")
               empresae.setAttribute(`id` , `tik${i}` )
               empresae.textContent = json[i].valid5;
               empresa.appendChild(empresae)

            }



          
          })



}


function modificar(i) {
let correo = "tik" + i + "co";

let vcorreo = document.getElementById(correo); 
correo2  =  vcorreo.innerHTML; 
console.log(correo2)
let dom = "tik" + i + "dom";
let dom1 = document.getElementById(dom).value; 
console.log(dom1)

let backend = {

      "correo": correo2,
      "dominio" : dom1


}


fetch("/modempresa", {
   method:"POST",
   headers: { 
      "Content-type": "application/json",
   },
   body:JSON.stringify(backend),
})
.then(res => res.json())
.then(json =>  {
   
   if (json == true) { window.location.href = "lusuarios"; } 
} )





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
          
            ResultadoBusqueda(parametroEnviar); 
          
          });}}
 });



function remover() {
   let elementos = document.querySelectorAll('.deleTotal');
   elementos.forEach(function(elemento) {
       elemento.remove();
   });

}


function ResultadoBusqueda (objeto) {
  

   let reversa = objeto;

   for(i=0; i< reversa.length; i++ ){


   
  
   const btn = document.getElementById("delete")
   const btne = document.createElement("i")
   btne.setAttribute(`class` , `btn fas fa-trash-alt deleTotal` )
   btne.setAttribute(`id` , `tik${i}d` )
   btne.setAttribute(`onclick` , `borrar( '${i}' )` );
   btne.textContent = "";
   btn.appendChild(btne)


   const ejecutando = document.getElementById("ejecutando")
   const ejecutandoe = document.createElement("i")
   ejecutandoe.setAttribute(`class` , `btn fas fa-check deleTotal` )
   ejecutandoe.setAttribute(`id` , `tik${i}ej` )
   ejecutandoe.setAttribute(`onclick` , `modificar( '${i}' )` );
   ejecutandoe.textContent = "";
   ejecutando.appendChild(ejecutandoe)


   const ejecutando1 = document.getElementById("codigoqr")
   const ejecutandoe1 = document.createElement("i")
   ejecutandoe1.setAttribute(`class` , `btn1 fas fa-qrcode deleTotal` )
   ejecutandoe1.setAttribute(`id` , `tik${i}ej` )
   ejecutandoe1.setAttribute(`onclick` , `generarqr( '${reversa[i].codigov}' )` );
   ejecutandoe1.textContent = "";
   ejecutando1.appendChild(ejecutandoe1)

   
   
   const correo = document.getElementById("correo")
   const correoe = document.createElement("p")
   correoe.setAttribute(`onclick` , `editarCorreo( '${i}' )` );
   correoe.setAttribute(`id` , `tik${i}co` )
   correoe.setAttribute(`class` , `deleTotal` )
   correoe.textContent = reversa[i].correo;
   correo.appendChild(correoe)

   const nombre = document.getElementById("nombre")
   const nombree = document.createElement("p")
   nombree.setAttribute(`onclick` , `editarNombre( '${i}' )` );
   nombree.setAttribute(`id` , `tik${i}nom` )
   nombree.setAttribute(`class` , `deleTotal` )
   nombree.textContent = reversa[i].nombre;
   nombre.appendChild(nombree)

   const dominio = document.getElementById("dominio")
   const dominioe = document.createElement("select")
   dominioe.setAttribute(`class` , `deleTotal` )
   dominioe.setAttribute(`id` , `tik${i}dom` )
   dominio.appendChild(dominioe)
   

  
     
   
      
      const empresa = document.getElementById("empresa")
      const empresae = document.createElement("p")
      empresae.setAttribute(`id` , `tik${i}em` )
      empresae.setAttribute(`class` , `deleTotal` )
      empresae.textContent = reversa[i].empresa;
      empresa.appendChild(empresae)
  

   const nivelv = document.getElementById("nivel1")
   const nivelev = document.createElement("i")
   nivelev.setAttribute(`class` , `btn fas fa-arrow-up deleTotal` )
   nivelev.setAttribute(`id` , `tik${i}ni` )
   nivelev.setAttribute(`onclick` , `nivel('${i}', true)` );
   nivelev.textContent = "";
   nivelv.appendChild(nivelev)

   const nivelf = document.getElementById("nivel2")
   const nivelef = document.createElement("i")
   nivelef.setAttribute(`class` , `btn fas fa-arrow-down deleTotal` )
   nivelef.setAttribute(`id` , `tik${i}ni` )
   nivelef.setAttribute(`onclick` , `nivel('${i}', false)` );
   nivelef.textContent = "";
   nivelf.appendChild(nivelef)

   
if ( reversa[i].valid2 == 1 && reversa[i].valid3 == 1 && reversa[i].valid4 == 1 ) { 

   const nivel = document.getElementById("nivel")
   const nivele = document.createElement("p")
   nivele.setAttribute(`class` , `deleTotal` )
   nivele.setAttribute(`id` , `tik${i}niv` )
   nivele.textContent = "Nivel 3";
   nivel.appendChild(nivele)

  } else if ( reversa[i].valid2 == 1 && reversa[i].valid3 == 1 && reversa[i].valid4 == 0 ) 
 
  {   const nivel = document.getElementById("nivel")
  const nivele = document.createElement("p")
  nivele.setAttribute(`class` , `deleTotal` )
  nivele.setAttribute(`id` , `tik${i}niv` )
  nivele.textContent = "Nivel 2";
  nivel.appendChild(nivele)     }  else if (reversa[i].valid2 == 1 && reversa[i].valid3 == 0 && reversa[i].valid4 == 0){

   const nivel = document.getElementById("nivel")
   const nivele = document.createElement("p")
   nivele.setAttribute(`class` , `deleTotal` )
   nivele.setAttribute(`id` , `tik${i}niv` )
   nivele.textContent = "Nivel 1";
   nivel.appendChild(nivele)

  }  else if (reversa[i].valid2 == 0 && reversa[i].valid3 == 0 && reversa[i].valid4 == 0){

   const nivel = document.getElementById("nivel")
   const nivele = document.createElement("p")
   nivele.setAttribute(`class` , `deleTotal` )
   nivele.setAttribute(`id` , `tik${i}niv` )
   nivele.textContent = "Nivel 0";
   nivel.appendChild(nivele)

  }  

  
  lista (i)
 


} }

  
     
  
function generarqr(i) {
   // Abrir ventana emergente
   var ventanaEmergente = window.open("", "_blank", "width=280,height=300");
 
   ventanaEmergente.document.write(`
     <html>
     <head>
         <title>Ventana emergente con imagen QR</title>
         <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js" integrity="sha512-is1ls2rgwpFZyixqKFEExPHVUUL+pPkBEPw47s/6NDQ4n1m6T/ySeDW3p54jp45z2EJ0RSOgilqee1WhtelXfA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

     </head>
     <body>
         <div id="Codigoqr"></div>
         <a target href="/ticketQR/${i}"> "https://www.soporte.intervia.com.ar/ticketQR/${i}"</a>

 
         <script defer>
        
             const correo = "correo@example.com";
             const divCodigoQR = document.getElementById('Codigoqr');
             new QRCode(divCodigoQR, "https://www.soporte.intervia.com.ar/ticketQR/" + "${i}");
         

        
         </script>
     </body>
     </html>
   `);
 }
 






          

            



          
          






          

            



          
          





