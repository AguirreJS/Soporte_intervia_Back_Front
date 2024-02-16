historial()

async function historial() { 

    fetch("/listausun2", {
        method:"POST",
        headers: { 
           "Content-type": "application/json",
        },
       
     })
     .then(res => res.json())
     .then(async json =>   {
      for(i=0; i< json.length; i++ ){

       
   

      
      
      const correo = document.getElementById("correo")
      const correoe = document.createElement("p")
      correoe.setAttribute(`id` , `tik${i}co` )
      correoe.textContent = json[i].correo;
      correo.appendChild(correoe)

      const nombre = document.getElementById("nombre")
      const nombree = document.createElement("p")
      nombree.setAttribute(`id` , `tik${i}nom` )
      nombree.textContent = json[i].nombre;
      nombre.appendChild(nombree)

      
         let empresa3 = json[i].empresa;
         const empresa = document.getElementById("empresa")
         const empresae = document.createElement("p")
         empresae.setAttribute(`id` , `tik${i}em` )
         empresae.textContent = empresa3;
         empresa.appendChild(empresae)
     
   
         const nivelv = document.getElementById("nivel1")
         const nivelev = document.createElement("i")
         nivelev.setAttribute(`class` , `btn fas fa-arrow-up` )
         nivelev.setAttribute(`id` , `tik${i}ni` )
         nivelev.setAttribute(`onclick` , `nivel('${i}', true)` );
         nivelev.textContent = "";
         nivelv.appendChild(nivelev)
   
         const nivelf = document.getElementById("nivel2")
         const nivelef = document.createElement("i")
         nivelef.setAttribute(`class` , `btn fas fa-arrow-down` )
         nivelef.setAttribute(`id` , `tik${i}ni` )
         nivelef.setAttribute(`onclick` , `nivel('${i}', false)` );
         nivelef.textContent = "";
         nivelf.appendChild(nivelef)

      
   if ( json[i].valid2 == 1 && json[i].valid3 == 1 && json[i].valid4 == 1 ) { 

      const nivel = document.getElementById("nivel")
      const nivele = document.createElement("p")
      nivele.setAttribute(`id` , `tik${i}niv` )
      nivele.textContent = "Nivel 3";
      nivel.appendChild(nivele)
  
     } else if ( json[i].valid2 == 1 && json[i].valid3 == 1 && json[i].valid4 == 0 ) 
    
     {   const nivel = document.getElementById("nivel")
     const nivele = document.createElement("p")
     nivele.setAttribute(`id` , `tik${i}niv` )
     nivele.textContent = "Nivel 2";
     nivel.appendChild(nivele)     }  else if (json[i].valid2 == 1 && json[i].valid3 == 0 && json[i].valid4 == 0){

      const nivel = document.getElementById("nivel")
      const nivele = document.createElement("p")
      nivele.setAttribute(`id` , `tik${i}niv` )
      nivele.textContent = "Nivel 1";
      nivel.appendChild(nivele)

     }  else if (json[i].valid2 == 0 && json[i].valid3 == 0 && json[i].valid4 == 0){

      const nivel = document.getElementById("nivel")
      const nivele = document.createElement("p")
      nivele.setAttribute(`id` , `tik${i}niv` )
      nivele.textContent = "Nivel 0";
      nivel.appendChild(nivele)

     }  

     
      
    
   
   
   } }
        
     
)  }




 
function  borrar(i) {
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

             
   
   fetch("/upleveln2", {
      method:"POST",
      headers: { 
         "Content-type": "application/json",
      },
   body: JSON.stringify( nivel )})
   .then(res => res.json())
   .then(json =>   {  
   
      if (json == true) { window.location.href = "lusuarion2"; } 
   
   
      }   )}
   

  


