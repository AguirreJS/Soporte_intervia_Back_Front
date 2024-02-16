function desacnotifi() { 

    fetch("/desactnoti", {
        method:"POST",
        headers: { 
           "Content-type": "application/json",
        },
       
     })
     .then(res => res.json())
     .then(json =>   { }) }