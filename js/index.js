/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var myScroll;
function loaded() {
	myScroll = new iScroll('wrapperListado');
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

/* * * * * * * *
 *
 * Use this for high compatibility (iDevice + Android)
 *
 */
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        mostrar();
    }
};

var client = new WindowsAzure.MobileServiceClient(
    "https://phonegapazure.azure-mobile.net/",
    "zPykhYjMQcxXAGVjbVsanhQZIfCNSb95"
);

function mostrarFormulario(){
    $( "#tituloFormulario" ).html('Nuevo Cliente');
    $("#scrollerFormulario").html('<div class="fondoValor"><input id="valor" type="text" placeholder="Valor del item"></div><div class="boton" onclick="insertar()">Enviar</div>');
    $( "#formulario" ).removeClass( "right" );
    $( "#formulario" ).addClass( "center" );
}

function volver(){
    $( "#formulario" ).removeClass( "center" );
    $( "#formulario" ).addClass( "right" );
}

/*MOSTRAR EL LISTADO DE CLIENTES*/
function mostrar(){
    $('#placeToInsert').html("");
    client.getTable("Clientes").read().then(function (todoItems) {
        var li=''; 
        for (var i = 0; i < todoItems.length; i++) {
            li += '<li onclick="ficha(\''+todoItems[i].id+'\')"><div>'+todoItems[i].text+'</div></li>';
        }
        $('#placeToInsert').append(li);
        myScroll.refresh();
    }, function (err) {
           alert("Error: " + err);
    });   
}
/***********/

/*BUSQUEDA DESDE EL LISTADO DE CLIENTES*/
function busqueda(texto){
    if(texto==""){
        mostrar();
    }else{
        $('#placeToInsert').html("");
        client.getTable("Clientes").where({
            text: texto
        }).read().then(function (todoItems) {
            var li=''; 
            for (var i = 0; i < todoItems.length; i++) {
                li += '<li onclick="ficha(\''+todoItems[i].id+'\')"><div>'+todoItems[i].text+'</div></li>';
            }
            $('#placeToInsert').append(li);
            myScroll.refresh();
        }, function (err) {
               alert("Error: " + err);
        });
    }
}
/***********/

/*INSERTAR NUEVO CLIENTE*/
function insertar(){
    var item = { text: $( "#valor" ).val() };
    client.getTable("Clientes").insert(item).done(function (results) {
        volver();
        mostrar();
    }); 
}
/***********/

/*MOSTRAR LA FICHA DE UN CLIENTE*/
function ficha(id){
    $( "#tituloFormulario" ).html('Ficha Cliente');
    $("#scrollerFormulario").html('<div class="fondoValor"><input id="valor" type="text" placeholder="Nombre"></div><div class="boton" onclick="modificar(\''+id+'\')">Modificar</div><div class="boton" onclick="eliminar(\''+id+'\')">Eliminar</div>');
    client.getTable("Clientes").where({
        id: id
    }).read().then(function (todoItems) {
        $("#valor").val(todoItems[0].text);
    }).done(function (result) {
        $( "#formulario" ).removeClass( "right" );
        $( "#formulario" ).addClass( "center" );
    });
}
/***********/

/*MODIFICAR UN CLIENTE*/
function modificar(id){
    var item = { text: $( "#valor" ).val() };
    client.getTable("Clientes").update({
        id: id,
        text: $( "#valor" ).val()
    }).done(function (result) {
        volver();
        mostrar();
    });
}
/***********/

/*ELIMINAR UN CLIENTE*/
function eliminar(id){
    client.getTable("Clientes").del({ id: id }).then(function (todoItems) {   
        volver();
        mostrar();  
    });
}
/***********/

