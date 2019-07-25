
var app = angular.module('AppAlojamiento', [] );

app.controller("AlojamientoTrimestralCtrl", function($scope, $state, OfertaEmpleoServi){
    
    OfertaEmpleoServi.cargando();
    $scope.alojamiento = { habitaciones:[], apartamentos:[], casas:[], cabanas:[], campings:[] };
    $scope.numero_dias = 0;
    
    
    OfertaEmpleoServi.getDataAlojamiento( $state.params.id, $state.params.offline )
        .then(function(data){
            
            if(data.alojamiento){  $scope.alojamiento = data.alojamiento; }
            
            $scope.servicios = data.servicios;
            $scope.numero_dias = data.numeroDias;
            OfertaEmpleoServi.cerrarCargando(); 
        }).catch(function(){
            alert("Error");
            OfertaEmpleoServi.cerrarCargando(); 
        });
    
    
    $scope.guardar = function(form){
        
        if (!form.$valid) {
            OfertaEmpleoServi.showAlertError(); return;
        }
        
        
        $scope.ErrorServicio = false;
        var sw = true;
        for ( var name in $scope.servicios ) {
          if($scope.servicios[name]==true){ sw = false; }
        }
        if(sw){
            $scope.ErrorServicio = true;
            OfertaEmpleoServi.showAlertError();  return;
        }
        
        OfertaEmpleoServi.cargando();
        var data = angular.copy($scope.alojamiento);
        data.encuesta = $state.params.id;
        data.servicios = angular.copy($scope.servicios);
        
        OfertaEmpleoServi.GuardaralojamientoTrimestral($state.params.id, data, $state.params.offline )
        .then(function(data){
            
            if(data.success){
                OfertaEmpleoServi.MensajeExitoso($state.params.id, $state.params.offline);
            }
            else{
                $scope.errores = data.errores;
                OfertaEmpleoServi.showAlertError();
                OfertaEmpleoServi.cerrarCargando(); 
            }
            
        }).catch(function(){
            alert("Error");
            OfertaEmpleoServi.cerrarCargando(); 
        });
        
    }
    
    
    $scope.resetDatos = function(servicio, estadoServi){
        
        switch (servicio) {
            case 1: /* habitaciones*/
                $scope.alojamiento.habitaciones[0] = (estadoServi  && $scope.alojamiento.habitaciones.length>0) ? $scope.alojamiento.habitaciones[0] : {};
                break;
            
            case 2: /* Apartamentos*/
                $scope.alojamiento.apartamentos[0] = (estadoServi  && $scope.alojamiento.apartamentos.length>0) ? $scope.alojamiento.apartamentos[0] : {};
                break;
                
            case 3: /* Casas*/
                $scope.alojamiento.casas[0] = (estadoServi  && $scope.alojamiento.casas.length>0) ? $scope.alojamiento.casas[0] : {};
                break;
            
            case 4: /* Cabañas*/
                $scope.alojamiento.cabanas[0] = (estadoServi  && $scope.alojamiento.cabanas.length>0) ? $scope.alojamiento.cabanas[0] : {};
                break;
            
            case 5: /* Campings*/
                $scope.alojamiento.campings[0] = (estadoServi  && $scope.alojamiento.campings.length>0) ? $scope.alojamiento.campings[0] : {};
                break;
            
            default: return ;
                // code
        }
        
    }
    
    
});

app.controller("AlojamientoMensualCtrl", function($scope, $state, OfertaEmpleoServi){
    
    OfertaEmpleoServi.cargando();
    $scope.alojamiento = { habitaciones:[], apartamentos:[], casas:[], cabanas:[], campings:[] };
    $scope.numero_dias = 0;
     
    
    OfertaEmpleoServi.getDataAlojamiento( $state.params.id, $state.params.offline )
    .then(function(data){
            
            if(data.alojamiento){ $scope.alojamiento = data.alojamiento; }
            
            $scope.servicios = data.servicios;
            $scope.numero_dias = data.numeroDias;
            OfertaEmpleoServi.cerrarCargando(); 
            
        }).catch(function(){
            alert("Error");
            OfertaEmpleoServi.cerrarCargando(); 
        });
    
    
    $scope.guardar = function(form){
        
        if (!form.$valid) {
            OfertaEmpleoServi.showAlertError(); return;
        }
        
        
        $scope.ErrorServicio = false;
        var sw = true;
        for ( var name in $scope.servicios ) {
          if($scope.servicios[name]==true){ sw = false; }
        }
        if(sw){
            $scope.ErrorServicio = true;
            OfertaEmpleoServi.showAlertError();  return;
        }
        
        OfertaEmpleoServi.cargando();
        var data = angular.copy($scope.alojamiento);
        data.encuesta = $state.params.id;
        data.servicios = angular.copy($scope.servicios);
        
        OfertaEmpleoServi.GuardaralojamientoMensual( $state.params.id, data, $state.params.offline )
        .then(function(data){
            
            if(data.success){
                OfertaEmpleoServi.MensajeExitoso($state.params.id, $state.params.offline);
            }
            else{
                $scope.errores = data.errores;
                OfertaEmpleoServi.showAlertError();
                OfertaEmpleoServi.cerrarCargando(); 
            }
            
        }).catch(function(){
            alert("Error");
            OfertaEmpleoServi.cerrarCargando(); 
        });
        
    }
    
    
    $scope.resetDatos = function(servicio, estadoServi){
        
        switch (servicio) {
            case 1: /* habitaciones*/
                $scope.alojamiento.habitaciones[0] = (estadoServi  && $scope.alojamiento.habitaciones.length>0) ? $scope.alojamiento.habitaciones[0] : {};
                break;
            
            case 2: /* Apartamentos*/
                $scope.alojamiento.apartamentos[0] = (estadoServi  && $scope.alojamiento.apartamentos.length>0) ? $scope.alojamiento.apartamentos[0] : {};
                break;
                
            case 3: /* Casas*/
                $scope.alojamiento.casas[0] = (estadoServi  && $scope.alojamiento.casas.length>0) ? $scope.alojamiento.casas[0] : {};
                break;
            
            case 4: /* Cabañas*/
                $scope.alojamiento.cabanas[0] = (estadoServi  && $scope.alojamiento.cabanas.length>0) ? $scope.alojamiento.cabanas[0] : {};
                break;
            
            case 5: /* Campings*/
                $scope.alojamiento.campings[0] = (estadoServi  && $scope.alojamiento.campings.length>0) ? $scope.alojamiento.campings[0] : {};
                break;
            
            default: return ;
                // code
        }
        
    }
    
    
});

