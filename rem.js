const select = document.getElementById("empresa");
select.addEventListener("change", function() { EnvioCorreo() })



document.addEventListener("DOMContentLoaded", function() {
   var input1 = document.getElementById("buscadorUser");
   input1.addEventListener("input", miFuncion);
 
   function miFuncion() {

   
      let buscadora = document.getElementById("buscadorUser").value; 
   
      if (buscadora.value == "") { console.log("Vacio") } else {

         let parametroEnviar=[];
         let z=0


         function BuscarPropiedad() {
if(input1.value == "") {  console.log("erro") }

            return new Promise((resolve, reject) => {
               for(i=0; i< BunsqueraArrayd.length; i++ ){
                  const indice = BunsqueraArrayd[i].empresa.toLowerCase().indexOf(input1.value);
                  const indice2 = BunsqueraArrayd[i].nombre.toLowerCase().indexOf(input1.value);
                  const indice3 = BunsqueraArrayd[i].apellido.toLowerCase().indexOf(input1.value);
                  const indice4 = BunsqueraArrayd[i].correo.toLowerCase().indexOf(input1.value);
                  if (indice !== -1 ||indice2  !== -1 ||indice3  !== -1 ||indice4  !== -1 ) { 
                     
                     parametroEnviar[z]= BunsqueraArrayd[i];
                     z++
                  
                  } 
               
               
              }
          
              resolve(parametroEnviar);
            });
          }
          
      
      
          BuscarPropiedad().then(() => {
          
            EnvioCorreo2(parametroEnviar); 
          
          });}}
 });

let BunsqueraArrayd;


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
 
 BunsqueraArrayd = json

})
 .catch(error => console.error(error));







function EnvioCorreo() { 

   removerUsers()

 

            for(i=0; i< BunsqueraArrayd.length; i++ ){
            
               console.log()

               if( empresa.value.toUpperCase() == BunsqueraArrayd[i].empresa.toUpperCase() ){
                 let info =  BunsqueraArrayd ;
                  let imprimir = info[i].nombre +  " (" + info[i].correo +")";
                  const empresa = document.getElementById("user")
                 const empresae = document.createElement("option")
                 empresae.setAttribute(`id` , `tik${i}` )
                 empresae.setAttribute(`alt` , `${info[i].correo}` )
                 empresae.setAttribute(`class` , `deleTotalUser` )
                 empresae.textContent = imprimir;
                 empresa.appendChild(empresae)
            
            
            }

            }



          
          }


          
function EnvioCorreo2(info) { 



   removerUsers()

 
   for(i=0; i< info.length; i++ ){

      let imprimir = info[i].nombre +  " (" + info[i].correo +")";
                const empresa = document.getElementById("user")
               const empresae = document.createElement("option")
               empresae.setAttribute(`id` , `tik${i}` )
               empresae.setAttribute(`alt` , `${info[i].correo}` )
               empresae.setAttribute(`class` , `deleTotalUser` )
               empresae.textContent = imprimir;
               empresa.appendChild(empresae) }

            }



            function cerrarEmail() {
               const overlay = document.querySelector('.overlay');
               overlay.style.display = 'none';
           }
          
        
     
  




 