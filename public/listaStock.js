

let listachk = [];

fetch("/listaStock", {
    method:"POST",
    headers: { 
       "Content-type": "application/json",
    },
   
 })
 .then(res => res.json())
 .then(json =>  {  

console.log(json)


   
for(i=0; i< json.length; i++ ){

    listachk[i] = json[i].codigo;
    
    const colum = document.getElementById(`colum`)
    const colume = document.createElement("div")
    colume.setAttribute(`class` , `listaStock` )
    colume.setAttribute(`id` , `colum${i}` )
    colum.appendChild(colume)


    const chk = document.getElementById(`colum${i}`)
    const shk1 = document.createElement("input")
    shk1.setAttribute(`type` , `checkbox` )
    shk1.setAttribute(`class` , `chk` )
    shk1.setAttribute(`id` , json[i].codigo )
    chk.appendChild(shk1)
    
    
    const stock = document.getElementById(`colum${i}`)
    const stock1 = document.createElement("p")
    stock1.setAttribute(`class` , `estado` )
    stock1.setAttribute(`id` , `tik${i}pub` )
    stock1.textContent = json[i].categoria;
    stock.appendChild(stock1)

      
    const stock1a = document.getElementById(`colum${i}`)
    const stock11 = document.createElement("p")
    stock11.setAttribute(`class` , `estado` )
    stock11.setAttribute(`id` , `tik${i}pub` )
    stock11.textContent = json[i].descripcion;
    stock1a.appendChild(stock11)


    const stock1a2 = document.getElementById(`colum${i}`)
    const stock112 = document.createElement("p")
    stock112.setAttribute(`class` , `estado` )
    stock112.setAttribute(`id` , `tik${i}pub` )
    stock112.textContent = json[i].estado;
    stock1a2.appendChild(stock112)


    const stock1a23 = document.getElementById(`colum${i}`)
    const stock1123 = document.createElement("p")
    stock1123.setAttribute(`class` , `estado` )
    stock1123.setAttribute(`id` , `tik${i}pub` )
    stock1123.textContent = json[i].sn;
    stock1a23.appendChild(stock1123)

    const stock1a234 = document.getElementById(`colum${i}`)
    const stock11234 = document.createElement("p")
    stock11234.setAttribute(`class` , `estado` )
    stock11234.setAttribute(`id` , `tik${i}pub` )
    stock11234.textContent = json[i].codigo;
    stock1a234.appendChild(stock11234)


    


 }})




function actualizar() {

  mostrarCargando()


    for(i=0; i< listachk.length; i++ ){

    



const checkbox = document.getElementById(listachk[i]);



if (checkbox.checked) {

    function ticket() {
        const urlActual = window.location.href;
        const indiceStock = urlActual.indexOf("stock/");
      
        if (indiceStock !== -1) {
          const parteDespuesDeStock = urlActual.substring(indiceStock + 6);
          return parteDespuesDeStock;
        } else {
          return null; // "stock/" no se encontró en la URL
        }
      }
      Nticket = ticket()

 objeto = {

ticket : Nticket,
codigo : listachk[i]


 }

 fetch("/usostock", {
    method:"POST",
    headers: { 
       "Content-type": "application/json",
    },
 body: JSON.stringify( objeto )})
 .then(res => res.json())
 .then(json =>   {  }   )
  
    } else {

       

    
    }

    

}

           

    function miFuncion() {
        window.close();
      }
      
      setTimeout(miFuncion, 2000);
  
  }



 
  function mostrarCargando() {
    var cargandoDiv = document.getElementById("cargando");
    
    // Mostrar el div de carga
    cargandoDiv.style.display = "block";
    
    // Ocultar el div después de 2 segundos
    setTimeout(function() {
      cargandoDiv.style.display = "none";
    }, 2000); // 2000 milisegundos (2 segundos)
  }
  


  






