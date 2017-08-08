$(document).ready(function() {
   $('#input-text').keypress(function(e) {
     if(e.keyCode === 13) {
       $('#output-text').val(e.target.value.toAscii85())
     }
   })
})
