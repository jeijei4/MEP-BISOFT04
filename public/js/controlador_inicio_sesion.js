'use strict';

const Input_Usuario = document.querySelector('#input_usuario');
const Input_Contrasenna = document.querySelector('#txt_contrasenna');
const Boton_Ingresar = document.querySelector('#boton_ingresar');

let mostrarAlerta = (mensaje) => {
    Swal.fire({
        toast: false,
        title: mensaje,
        type: 'warning',
        position: 'center',
        timer: 10000,
        //animation: false,
        //  customClass: 'animated tada',
        showConfirmButton: true
    });
};


let obtener_Datos = () => {
    let usuario = Input_Usuario.value;
    let contrasenna = Input_Contrasenna.value;

    let errorBlancos = validar(usuario, contrasenna);

    if (!errorBlancos) {
        let usuarioAceptado = validar_credenciales(usuario, codificar(contrasenna));
        if (usuarioAceptado) {

            const tipoUsuario = localStorage.getItem('tipoUsuario');

            if ('undefined' !== typeof tipoUsuario && null !== tipoUsuario) {

                const elTipoUsuario = tipoUsuario.toLowerCase();
                const ocupaRedireccion = localStorage.getItem('quienIniciaSesion');

                //switch para calquier cosa que no sea redireccionar (excepto el default).
                switch (elTipoUsuario) {
                    case 'superadmin':
                        break;
                    case 'centroeducativo':
                        localStorage.setItem('padreVerPerfilCEdu', localStorage.getItem('id'));
                        break;
                    case 'padrefamilia':
                        localStorage.setItem('idBuscarPadre', localStorage.getItem('id'));
                        break;
                    default:
                        localStorage.clear();
                        console.error('Tipo de usuario desconocido');
                        location.replace('inicio_sesion.html');
                        break;
                }

                if (null !== ocupaRedireccion) {
                    localStorage.removeItem('quienIniciaSesion');
                    const aDonde = decodeURIComponent(ocupaRedireccion);
                    location.replace(aDonde);
                } else {

                    //switch para redireccionar.
                    switch (elTipoUsuario) {
                        case 'superadmin':
                            location.replace('perfil_admin.html');
                            break;
                        case 'centroeducativo':
                            location.replace('perfil_centro.html');

                            break;
                        case 'padrefamilia':
                            location.replace('principal_padres.html');
                            break;
                    }

                }
            } else {
                localStorage.clear();
                mostrarAlerta('Error de sesión');
                location.replace('inicio_sesion.html');
            }

        } else {
            mostrarAlerta('El nombre de usuario o la contraseña son incorrectos');
        }
    } else {
        mostrarAlerta('Por favor ingrese el usuario y la contraseña');
    }
};

let validar = (pusuario, pcontrasenna) => {
    let error = false;

    if (pusuario == '') {
        error = true;
        input_usuario.classList.add('error_input');
    } else {
        input_usuario.classList.remove('error_input');
    }

    if (pcontrasenna == '') {
        error = true;
        txt_contrasenna.classList.add('error_input');
    } else {
        txt_contrasenna.classList.remove('error_input');
    }

    return error;
};

if (Boton_Ingresar) {
    Boton_Ingresar.addEventListener('click', obtener_Datos);
}


window.onload = () => {
	localStorage.clear();
    if (Input_Usuario) {
        Input_Usuario.select();
        Input_Usuario.focus();
    }
};
