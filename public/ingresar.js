






let users = [];

function buscar(emp,num) {
   console.log(emp)

   objeto =   { "empresa" : emp  }

fetch("/listausu2", {
   method:"POST",
   headers: {"Content-type":"application/json"},
   body: JSON.stringify(objeto),})
   .then(res => res.json())
   .then(json =>  {  

      console.log(json)
      
      users = 15;

  

     const id = document.getElementById("id")
     const ide = document.createElement("p")
     ide.setAttribute(`id` , `tik${num}` )
     ide.textContent = json;
     id.appendChild(ide)


       
     



 })}



   
   


 



const checkbox = document.getElementById("abonado");

EnvioGet();

function EnvioGet() { 

	fetch('/sessiononline', { method: 'GET'})
	.then(res => res.json())
	.then(data => {

	  if (data.online == true) { 
      document.getElementById("Usuario").innerHTML=`${data.nombre}`
	   document.getElementById("Usuario").style.display = "inline-block"
	   document.getElementById("iniciar").style.display ="none";	
		document.getElementById("regis").style.display = "none";
		document.getElementById("salir").style.display = "inline-block";
	
   
   }

		else				    { document.getElementById("salir").style.display = "none";}

	})} 

   function salir() { 

      fetch('/salir', { method: 'GET'})
      .then(res => res.json())
      .then(data => {
   
        function salir() { window.location.href = "index.html"; } ; salir()
   
      })} 

function ingresar () { let confirmacion = confirm("¿Esta seguro de que desea cargar esta empresa?")

if (confirmacion == true){ ingresarok() }

}


function ingresarok() {

   let empresa = document.getElementById("empresa").value;
   let dominio = document.getElementById("dominio").value;  



if (empresa == "") {
     alert("El nombre de la empresa no puede estar vacio")
   } else {


   const checkbox = document.getElementById("abonado").checked;

  

   


    objeto =  {   "empresa" : empresa,
                  "dominio" : dominio,
                  "abonado": checkbox  }

    fetch("/ingempresa", {
	
        method:"POST",
        headers: {"Content-type":"application/json"},
           body: JSON.stringify(objeto),})
           .then(res => res.json())
           .then(json =>  {
                              if(json == true )  { window.location.href = "empresas";   } }


            
            ) }}




solicitude()

function solicitude() { 
    fetch("/solicitudemp", {
	
        method:"POST",
        headers: {"Content-type":"application/json"},
           })
           .then(res => res.json())
           .then(json =>  { 
            for(i=0; i< json.length; i++ ){ 


                  
      const btn = document.getElementById("delete")
      const btne = document.createElement("img")
      btne.setAttribute(`class` , `btn` )
      btne.setAttribute(`id` , `tik${i}d` )
      btne.setAttribute(`src` , `icon/no.png` )
      btne.setAttribute(`onclick` , `borrar( '${i}' )` );
      btne.textContent = "";
      btn.appendChild(btne)

      const dominio = document.getElementById("dominio1")
      const dominioe = document.createElement("p")
      dominioe.setAttribute(`id` , `nombreDominio${i}`)
      dominioe.setAttribute(`onclick` , `editarDominio( '${i}' )` );
      dominioe.textContent = json[i].dominio;
      dominio.appendChild(dominioe)

    const empresa = document.getElementById("empresa1")
    const empresae = document.createElement("p")
    empresae.setAttribute(`id` , `nombreEmpresa${i}`)
    empresae.setAttribute(`onclick` , `editarEmpresa( '${i}' )`)
    empresae.textContent = json[i].empresa;
    empresa.appendChild(empresae)
   


      //////// users       
      buscar(json[i].empresa,i)  
     

if (json[i].valid5 == "true") {   
      const codigo = document.getElementById("codigo")
      const codigoe = document.createElement("p")
      codigoe.textContent = "SI";
      codigo.appendChild(codigoe) }
      
      else if (json[i].valid5 == "false") {
      const codigo = document.getElementById("codigo")
      const codigoe = document.createElement("p")
      codigoe.textContent = "NO";
      codigo.appendChild(codigoe)

      }



            } 


           })

 }

 function  borrar(i) {

  let pregunta = confirm("Estas seguro que deseas eliminar esta empresa? Recuerda que todos los usuarios registrados a nombre de esa empresa van a seguir existiendo en la base de datos.")
if (pregunta == true) { borrar1(i)  }

 }


 function  borrar1(i) {
    id = "nombreEmpresa" + i;
  
   var demo = document.getElementById(id);
   document.getElementById(id).style.background = "red";
 
 id  =  demo.innerHTML 
 
 objeto =   { "id" : id    }
 
 fetch("/deletem", {
    method:"POST",
    headers: { 
       "Content-type": "application/json",
    },
 body: JSON.stringify( objeto )})
 .then(res => res.json())
 .then(json =>   {  
 

 
 
    }   )
   
 

   
   }



      
   
             





    

