// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 
                           'starter.controllers',
                           'ion-datetime-picker',
                           'angular-svg-round-progressbar',
                           'starter.directives',
                           'ionic-toast',
                           'ionic-sidemenu',
                           'whimsicalRipple', 
                           'ionic-modal-select',
                           'turismo.interno.services',
                           'turismo.receptor.services',
                           'general.services',
                           'checklist-model',
                           'starter.directives',
                           'factories',
                           'ngCordova',
                           'OfertaYempleo'
                           ])

.constant('CONFIG', {
  APIURL: "http://localhost:8000/",
})

.run(function($ionicPlatform, $ionicPopup, $rootScope, $ionicPickerI18n) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $ionicPickerI18n.weekdays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    $ionicPickerI18n.months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $ionicPickerI18n.ok = "Ok";
    $ionicPickerI18n.cancel = "Cancelar";
    $ionicPickerI18n.okClass = "button-stable ripple";
    $ionicPickerI18n.cancelClass = "button-stable ripple";

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.overlaysWebView(false);
      //StatusBar.styleDefault();
    }

    if (window.Connection) {
      
      if (navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN) {
        $ionicPopup.alert({
          title: "No hay conexión a internet",
          content: "Todas las tareas que realice sin conexión serán sincronizadas cuando tenga internet, recuerde no cerrar sesión para no perder el trabajo realizado"
        }) 
      }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  //$ionicConfigProvider.views.transition('none');
  $httpProvider.useApplyAsync(true);

  $stateProvider

  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController',
    cache: false
  })

  .state('logout', {
    url: '/logout',
    templateUrl: 'templates/login.html',
    controller: 'logoutController',
    cache: false
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })

  

  /******************Oferta y Empleo***********************/
    
  .state('app.listadoProveedores', {
    url: '/listarProveedores',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertaYempleo/ListadoProveedores.html',
        controller: 'ListadoProveedoresCtrl'
      }
    }
  })
  
  .state('app.listadoEncuestasOfertaEmpleo', {
    url: '/listadoEncuestasOfertaEmpleo',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertaYempleo/ListadoEncuestas.html',
        controller: 'ListadoEncuestasOfertaEmpeloCtrl'
      }
    }
  })

  .state('app.listadoEncuestasLLenas', {
    url: '/listadoEncuestasLLenas/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertaYempleo/listadoEncuestasLLenas.html',
        controller: 'ListadoEncuestasLlenasProveedoresCtrl'
      }
    }
  })

  .state('app.listadoEncuestasSinLLenar', {
    url: '/listadoEncuestasSinLLenar/:id/:offline',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertaYempleo/listadoEncuestasSinLLenar.html',
        controller: 'ListadoEncuestasSinLlenarProveedoresCtrl'
      }
    }
  })
  
  .state('app.actividadComercial', {
    url: '/actividadComercial/:mes/:anio/:id/:offline',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertaYempleo/actividadComercial.html',
        controller: 'actividadComercialCtrl'
      }
    }
  })
   
   .state('app.alojamientomensual', {
      url: '/alojamientomensual/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/alojamientoMensual.html',
          controller: 'AlojamientoMensualCtrl'
        }
      }
    })
   
    .state('app.alojamientotrimestral', {
      url: '/alojamientotrimestral/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/alojamientoTrimestral.html',
          controller: 'AlojamientoTrimestralCtrl'
        }
      }
    })

    
    .state('app.caracterizacionTransporte', {
      url: '/caracterizacionTransporte/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/caracterizacionTransporte.html',
          controller: 'caracterizacionTransporteCtrl'
        }
      }
    })
    
    .state('app.caracterizacionAlimentos', {
      url: '/caracterizacionAlimentos/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/caracterizacionAlimentos.html',
          controller: 'caracterizacionAlimentosCtrl'
        }
      }
    })
    .state('app.capacidadAlimentos', {
      url: '/capacidadAlimentos/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/capacidadAlimentos.html',
          controller: 'capacidadAlimentosCtrl'
        }
      }
    })
    
    .state('app.caracterizacionAgenciasOperadora', {
      url: '/caracterizacionAgenciasOperadora/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/caracterizacionAgenciasOperadora.html',
          controller: 'caracterizacionAgenciaCtrl'
        }
      }
    })
    .state('app.ocupacionAgenciasOperadora', {
      url: '/ocupacionAgenciasOperadora/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/ocupacionAgenciasOperadora.html',
          controller: 'ocupacionAgenciasOperadoraCtrl'
        }
      }
    })
    
    .state('app.agenciasViajes', {
      url: '/agenciasViajes/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/agenciasViajes.html',
          controller: 'caracterizacionAgenciaViajesCtrl'
        }
      }
    })
    .state('app.OfertaagenciasViajes', {
      url: '/OfertaagenciasViajes/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/OfertaagenciasViajes.html',
          controller: 'ofertaAgenciaViajesCtrl'
        }
      }
    })
    
    
    .state('app.empleoMensual', {
      url: '/empleoMensual/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/empleoMensual.html',
          controller: 'empleoMensualCtrl'
        }
      }
    })
    
    .state('app.empleoTrimestral', {
      url: '/empleo/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/empleoTrimestral.html',
          controller: 'empleoTrimestralCtrl'
        }
      }
    })
    
    
    .state('app.empleadosCaracterizacion', {
      url: '/empleadosCaracterizacion/:id/:offline',
      views: {
        'menuContent': {
          templateUrl: 'templates/ofertaYempleo/empleadosCaracterizacion.html',
          controller: 'empleoCaracterizacionCtrl'
        }
      }
    })

  /*****************************************/
  
 
  .state('app.encuestaSitio', {
    url: '/encuestaSitio',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuestaSitio.html',
        controller: 'encuestaSitioController'
      }
    }
  })

  .state('app.encuestaAdmin', {
    url: '/encuestaAdmin',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuestaAdmin.html',
        controller: 'encuestaAdminController'
      }
    }
  })
  
  
  //empleo mensual
  

/*
  .state('app.actividadComercialAdmin', {
    url: '/actividadComercialAdmin',
    views: {
      'menuContent': {
        templateUrl: 'templates/actividadComercialAdmin.html',
        controller: 'actividadComercialAdminController'
      }
    }
  })

  .state('app.caracterizacionAlojamientos', {
    url: '/caracterizacionAlojamientos',
    views: {
      'menuContent': {
        templateUrl: 'templates/caracterizacionAlojamientos.html',
        controller: 'caracterizacionAlojamientosController'
      }
    }
  })

  .state('app.ofertaAlojamiento', {
    url: '/ofertaAlojamiento',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertaAlojamiento.html',
        controller: 'ofertaAlojamientoController'
      }
    }
  })
 
  .state('app.empleoMensual', {
    url: '/empleoMensual',
    views: {
      'menuContent': {
        templateUrl: 'templates/empleoMensual.html',
        controller: 'empleoMensualController'
      }
    }
  })

  .state('app.numeroEmpleados', {
    url: '/numeroEmpleados',
    views: {
      'menuContent': {
        templateUrl: 'templates/numeroEmpleados.html',
        controller: 'numeroEmpleadosController'
      }
    }
  })

  .state('app.empleadosCaracterizacion', {
    url: '/empleadosCaracterizacion',
    views: {
      'menuContent': {
        templateUrl: 'templates/empleadosCaracterizacion.html',
        controller: 'empleadosCaracterizacionController'
      }
    }
  })

  .state('app.encuestasAdministrador', {
    url: '/encuestasAdministrador',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuestasAdministrador.html',
        controller: 'encuestasAdministradorController'
      }
    }
  })

  .state('app.proveedoresActivos', {
    url: '/proveedoresActivos',
    views: {
      'menuContent': {
        templateUrl: 'templates/proveedoresActivos.html',
        controller: 'proveedoresActivosController'
      }
    }
  })

  .state('app.datosRegistroNacionalTurismo', {
    url: '/datosRegistroNacionalTurismo',
    views: {
      'menuContent': {
        templateUrl: 'templates/datosRegistroNacionalTurismo.html',
        controller: 'datosRegistroNacionalTurismoController'
      }
    }
  })

  .state('app.dane', {
    url: '/dane',
    views: {
      'menuContent': {
        templateUrl: 'templates/poblacionDANE.html',
        controller: 'daneController'
      }
    }
  })  ;
*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
