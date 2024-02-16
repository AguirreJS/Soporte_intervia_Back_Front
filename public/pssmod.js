
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
 
   console.log(json)
   BusArrayd = json
 })
 .catch(error => console.error(error));

let BusArrayd;












async function historial(parametro) { 


      let reversa = parametro;
  
      
      for(i=0; i< reversa.length; i++ ){

    
      const correo = document.getElementById("correo")
      const correoe = document.createElement("p")
      correoe.setAttribute(`class` , `deleTotal` )
      correoe.setAttribute(`id` , `tik${i}co` )
      correoe.textContent = reversa[i].correo;
      correo.appendChild(correoe)

      const nombre = document.getElementById("nombre")
      const nombree = document.createElement("p")
      nombree.setAttribute(`class` , `deleTotal` )
      nombree.setAttribute(`id` , `tik${i}nom` )
      nombree.textContent = reversa[i].nombre;
      nombre.appendChild(nombree)
      
         let empresa3 = reversa[i].empresa;
         const empresa = document.getElementById("empresa")
         const empresae = document.createElement("p")
         empresae.setAttribute(`class` , `deleTotal` )
         empresae.setAttribute(`id` , `tik${i}em` )
         empresae.textContent = empresa3;
         empresa.appendChild(empresae)
     

      
         const contraseña = document.getElementById("nivel")
         const contraseñaa = document.createElement("input")
         contraseñaa.setAttribute(`class` , `deleTotal` )
         contraseñaa.setAttribute(`id` , `tik${i}imp` )
         contraseña.appendChild(contraseñaa)


         const modi = document.getElementById("nivel1")
         const modia = document.createElement("button")
         modia.setAttribute(`class` , `deleTotal` )
         modia.setAttribute(`id` , `tik${i}modi` )
         modia.setAttribute(`onclick` , `pssw(${i})` )
         modia.textContent = "Modificar";
         modi.appendChild(modia)
   

      
   

     
      
    
   
   
   } }
        
     




 


function pssw(i) {

   let npss = "tik"+i+"imp"

let nueva = document.getElementById(npss).value;
if (nueva === "") {
  alert("La contraseña no puede estar vacía");
} else {

   

let npss = "tik"+i+"imp"

let correo = "tik"+i+"co"

let nueva = document.getElementById(npss).value;

let correov = document.getElementById(correo);

let correo2 = correov.innerHTML 

console.log(correo2 + nueva)


let objeto = { 

    "correo" : correo2 ,
    "nuevaContraseña" : nueva


} 




fetch("/newpssad", {
    method:"POST",
    headers: { 
       "Content-type": "application/json",
    },
    body:JSON.stringify(objeto),
 })
 .then(res => res.json())
 .then(json =>   { 

    if (json == true) {   window.location.href = "pssmod";}



  })





} }



function remover() {
   let elementos = document.querySelectorAll('.deleTotal');
   elementos.forEach(function(elemento) {
       elemento.remove();
   });

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

   


 




