'use strict';

const CardsCentros = document.querySelector('#cards_centros');
const FiltroCards = document.querySelector('#filtrar_cards');

let elContenedor = [];

let irAlPerfil = (idCEdu) => {
    localStorage.setItem('verPerfilCEdu', idCEdu);

    const tipoUsuario = localStorage.getItem('tipoUsuario');
    switch (tipoUsuario.toLowerCase()) {
        case 'superadmin':
            location.replace('./perfilCentroAdmin.html');
            break;
        case 'padrefamilia':
            location.replace('./perfilCentroPadre.html');
            break;
        default:
            console.error('El tipo de usuario no tiene página de redirección');
            break;
    }
};


let llenarContenido = () => {

    const filtros = FiltroCards.value;
    const cantFiltros = filtros.trim().length;

    //Limpiamos antes de añadir los cards:
    CardsCentros.innerHTML = '';

    elContenedor.forEach(obj => {

        if (cantFiltros < 1 || combux.contiene(filtros, obj['nombre'])) {

            let card = document.createElement('div');
            card.classList.add('contendedor_card_principal');

            let contenedor_card = document.createElement('div');
            contenedor_card.classList.add('contendedor_cards');


            let centro_nombre = document.createElement('h1');
            centro_nombre.innerHTML = '<strong class="descripcion">Nombre: </strong>' + obj['nombre'];

            let telefono = document.createElement('p');
            telefono.innerHTML = '<strong class="descripcion">Teléfono: </strong>' + obj['telefono'];

            let correo = document.createElement('p');
            correo.innerHTML = '<strong class="descripcion">Correo: </strong>'+ obj['correo'];

            let provincia = document.createElement('span');
            provincia.innerHTML = '<strong class="descripcion">Provincia: </strong>' + obj['provincia'];

            let direccion = document.createElement('span');
            direccion.innerHTML = '<strong class="descripcion">Dirección: </strong>'+ obj['direccion'];

            let fechaSolicitud = document.createElement('span');

            fechaSolicitud.innerHTML = 'Fecha de solicitud: ' + obj['solicitudFechaCorta'];


            // Obtenemos la cantidad de "días hábiles" que lleva pendiente de aprobación.
            let diasSolicitud = document.createElement('p');

            if (obj['solicitudDiasHabiles'] > 3) {
                diasSolicitud.innerHTML = 'Días hábiles pendientes: <span style="color:#ED4C67;">' + obj['solicitudDiasHabiles'] + '</span>';
            } else {
                diasSolicitud.innerHTML = 'Días hábiles pendientes: ' + obj['solicitudDiasHabiles'];
            }

            let verMas = document.createElement('a');
            verMas.addEventListener('click', () => {
                irAlPerfil(obj['_id']);
            }, false);
            verMas.innerHTML = '<i class="fas fa-id-card"></i>';
            //se crea el boton para aprobar el centro educativo Creado por Johan 
            let btn_aprobar = document.createElement('button');
            btn_aprobar.type = 'button';
            btn_aprobar.textContent = 'Aprobar';
            btn_aprobar.dataset.idCEdu = obj['_id'];
            //se llama la función para aprobar el centro educativo 
            //con un seewtAlert para confimar si quiere aprobarlo 
            btn_aprobar.addEventListener('click', function(){
                Swal.fire({
                    title: '¿Está seguro que desea aprobar el centro educativo?',
                    text: "Ésta acción no se puede revertir",
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '¡Sí, estoy seguro!'
                  }).then((result) => {
                    if (result.value) {
                        aprobar_cedu( this.dataset.idCEdu);
                        Swal.fire(
                        {
                            text: '¡Centro educativo aprobado con éxito!',
                            type: 'success'
                        }
                          )
                     cargarCEdu();
                    }else{
                        Swal.fire(
                            {
                                text: '¡Centro educativo no fue aprobado!',
                                type: 'info'
                            }
                        )
                  }
            });
         });

            card.appendChild(centro_nombre);
            contenedor_card.appendChild(telefono);
            contenedor_card.appendChild(correo);
            contenedor_card.appendChild(provincia);
            contenedor_card.appendChild(direccion);
            contenedor_card.appendChild(fechaSolicitud);
            contenedor_card.appendChild(diasSolicitud);
            contenedor_card.appendChild(btn_aprobar);
            contenedor_card.appendChild(verMas);
            

            card.appendChild(contenedor_card);
            CardsCentros.appendChild(card);

        };
    });
};

let cargarCEdu = () => {
    listarCEdu_sin_aprobar((pSuccess, pMessage) => {
        if (pSuccess) {
            if ('object' == typeof pMessage) {

                FiltroCards.value = '';
                FiltroCards.addEventListener('keyup', llenarContenido);
                elContenedor = pMessage;
                llenarContenido();

            } else {
                CardsCentros.innerHTML = '';
                console.error(pMessage);
            }
        } else {
            CardsCentros.innerHTML = '<h4>' + pMessage + '</h4>';
            console.error(pMessage);
        }
    });
};



window.onload = () => {
    cargarCEdu();
};

