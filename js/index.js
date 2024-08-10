const user = JSON.parse(localStorage.getItem('login_success')) || false;
if (!user) {
    window.location.href = 'login.html';
}

const logout = document.querySelector('#logout');

logout.addEventListener('click', () => {
    Swal.fire({
        icon: 'info',
        title: 'Hasta pronto!',
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        localStorage.removeItem('login_success');
        window.location.href = 'login.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loan-form');
    const resultsDiv = document.getElementById('results');
    const clearResultsBtn = document.getElementById('clear-results');
    const typeSelect = document.getElementById('type');

    let tiposDePrestamos = [];


    function obtenerDatos() {
        fetch('data/datos_prestamos.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud de datos');
                }
                return response.json();
            })
            .then(data => {
                tiposDePrestamos = data.tiposDePrestamos;
                llenarSelectTipos();
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });
    }


    function llenarSelectTipos() {
        tiposDePrestamos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.tipo;
            option.textContent = tipo.tipo;
            typeSelect.appendChild(option);
        });
    }


    function calcularCuota(tipo, monto, plazo) {
        const tipoPrestamo = tiposDePrestamos.find(p => p.tipo === tipo);
        if (!tipoPrestamo) {
            throw new Error('Tipo de préstamo no encontrado');
        }
        
        const tasaMensual = tipoPrestamo.tasaInteres / 100 / 12;
        const cuota = monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo));
        
        return cuota.toFixed(2);
    }


    form.addEventListener('submit', function (event) {
        event.preventDefault();


        const tipoDePrestamo = typeSelect.value;
        const amount = parseFloat(document.getElementById('amount').value);
        const months = parseInt(document.getElementById('months').value);

        if (validarValores(amount, months)) {
            try {
                const pagoMensual = calcularCuota(tipoDePrestamo, amount, months);
                const montoTotal = pagoMensual * months;
                const totalIntereses = montoTotal - amount;

                const resultado = `
                    <h3>Resultados</h3>
                    <p><strong>Monto del Préstamo:</strong> $${amount.toFixed(2)}</p>
                    <p><strong>Tipo de Préstamo:</strong> ${tipoDePrestamo}</p>
                    <p><strong>Plazo del Préstamo:</strong> ${months} meses</p>
                    <p><strong>Pago Mensual:</strong> $${pagoMensual}</p>
                    <p><strong>Total de Intereses:</strong> $${totalIntereses.toFixed(2)}</p>
                    <p><strong>Monto Total a Pagar:</strong> $${montoTotal.toFixed(2)}</p>
                `;
                resultsDiv.innerHTML = resultado;
                clearResultsBtn.style.display = 'inline-block'; 
            } catch (error) {
                resultsDiv.innerHTML = '<p>Ocurrió un error al calcular la cuota.</p>';
                clearResultsBtn.style.display = 'none'; 
            }
        } else {
            resultsDiv.innerHTML = '<p>Por favor, ingrese valores válidos y positivos.</p>';
            clearResultsBtn.style.display = 'none'; 
        }
    });


    clearResultsBtn.addEventListener('click', () => {
        resultsDiv.innerHTML = ''; 
        clearResultsBtn.style.display = 'none'; 
    });

    function validarValores(monto, meses) {
        return monto > 0 && meses > 0;
    }

    obtenerDatos();
});
