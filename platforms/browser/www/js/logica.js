var usuario_session='';
var id_supervisor=0;

var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },


//$(function(){
    //var usuario_session='';
    //var id_supervisor=0;

    /*$.getJSON("http://192.168.0.180/finanzas/php/verificar_session.php", function(data){
        var datos = JSON.parse(data);
        if(datos.dato == 1){
            usuario_session=datos.usuarioli;
            id_supervisor=datos.id_supervisor;

            $('#p_login').css('display','none');
            $('#p_visitas').css('display','block');

            muestraObras(id_supervisor);
        }else{
            alert('sale');
            $('#p_login').css('display','block');
            $('#p_visitas').css('display','none');
        }
    });*/

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    $('#b_login').click(function(){
        var info={
            'usuario':$('#i_usuario').val(),
            'password':$('#i_password').val()
        };

        $.post("http://192.168.0.180/finanzas/php/login.php",info,function(data){
            var datos = JSON.parse(data);

            if(datos.dato == '1'){
                usuario_session=datos.usuarioli;
                id_supervisor=datos.id_supervisor;

                $('#p_login').css('display','none');
                $('#p_visitas').css('display','block');

                muestraObras(id_supervisor);
            }else{
                alert(datos.mensaje);
            }

        });

    });  
    
    function muestraObras(id_supervisor){
        
        $.getJSON("http://192.168.0.180/finanzas/php/busca_obras.php",{'id_supervisor':id_supervisor},function(data){
            var lista="";
            $.each(data, function(i, field)
            {
                lista+="<li class='list-group-item obras' data-id_obra='"+field.id_obra+"' data-contrato='"+field.contrato+"'>"+field.contrato+' '+field.cliente+"</li>";
            });

            $("#lista").append(lista); 
        });
    }

    $('#lista').on('click','li',function(){
        $('.list-group-item').css({'background-color':'white','color':'black'});
        $(this).css({'background-color':'gray','color':'white'});
        var id = $(this).data('id_obra');
        var contrato = $(this).data('contrato');
        
        $('#p_visitas').css('display','none');
        $('#b_foto').attr('alt',id);
        $('#p_botones').css('display','block');
    });

    $('#i_filtro').keyup(function(){
        $('.list-group-item').css({'background-color':'white','color':'black'});
        filtrar('i_filtro', 'obras');
    });

    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function(elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    function filtrar(campo,renglon){
        var aux = $("#"+campo).val();
        if(aux == '')
        {
            $('.'+renglon).show();
        }
        else
        {
            $('.'+renglon).hide();
            $('.'+renglon+':contains(' + aux + ')').show();
            aux = aux.toLowerCase();
            $('.'+renglon+':contains(' + aux + ')').show();
            aux = aux.toUpperCase();
            $('.'+renglon+':contains(' + aux + ')').show();
        }
    }
    var id_obra=0;
    var nom_foto = '';
    var latitud = '';
    var longitud = '';

    $('#b_foto').click(function(){
        id_obra=$(this).attr('alt');

        navigator.geolocation.getCurrentPosition(successGeo, errorGeo);

    });

    function successGeo(position){
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;

        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.PNG
        });
            
        $('#coordenadas').text(position.coords.longitude+' - '+position.coords.latitude);
    }

    function errorGeo(error){
        alert('message: ' + error.message); 
    }

    function onSuccess(imageURI) {
        $('#div_foto').html('<img style="width:150px;height:150px;" id="myImage" src="'+imageURI+'" />');
        subirImagen(imageURI);
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }

    function guardarFoto(){
        var info={
            'id_obra' : id_obra,
            'latitud' : latitud,
            'longitud' : longitud,
            'descripcion' : $('#ta_descripcion').val(),
            'id_supervisor' : id_supervisor
        };

        $.post("http://192.168.0.180/finanzas/php/guardar_registro.php",info,function(data){
            if(data == 1){
                alert('Datos guardados.');
            }else{
                alert('Error al insertar los datos');
            }
           
        });
    }

    $('#b_guardar').click(function(){
        guardarFoto();
    });

    function subirImagen(fileURL) {
            alert('subirImagen');
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/png";
        options.httpMethod = "POST";

        var params = new Object();
            params.id_obra = $('#b_foto').attr('alt');
            //params.boton = 1;

            options.params = params;
    
        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI("http://192.168.0.180/finanzas/php/guarda_foto.php"), uploadSuccess, uploadFail, options);
    
    }
    
    function uploadSuccess(r) {
        //alert("Code = " + r.responseCode+" Response = " + r.response+" Sent = " + r.bytesSent);
        alert('Imagen guardada');
    }
    
    function uploadFail(error) {
        //alert("An error has occurred: Code = " + error.code+ " upload error source " + error.source+" upload error target " + error.target);
        alert('Error al guardar imagen');
    }

//);

}

};

app.initialize();