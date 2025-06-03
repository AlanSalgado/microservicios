<!DOCTYPE html>
<html lang="es">
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba de PDF - Inventario</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 50px;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .title {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        
        .btn {
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
            display: block;
            margin: 0 auto;
        }
        
        .btn:hover {
            background-color: #0056b3;
        }
        
        .btn:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
        }
        
        .loading {
            display: none;
            text-align: center;
            margin-top: 20px;
            color: #666;
        }
        
        .error {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            display: none;
        }
        
        .success {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            display: none;
        }
        
        .params-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .params-info h4 {
            margin-top: 0;
            color: #495057;
        }
        
        .params-info pre {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 3px;
            font-size: 12px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div >
            
        <button id="generatePdfBtn" class="btn">
            Generar PDF
        </button>
        
        <div id="loading" class="loading">
            <p>Generando PDF... Por favor espere.</p>
        </div>
        
        <div id="error" class="error"></div>
        <div id="success" class="success"></div>
    </div>

    <script>
        // Función para mostrar mensajes
        function showMessage(type, message) {
            const errorDiv = document.getElementById('error');
            const successDiv = document.getElementById('success');
            
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            if (type === 'error') {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            } else if (type === 'success') {
                successDiv.textContent = message;
                successDiv.style.display = 'block';
            }
        }

        // Función para obtener el token CSRF
        function getCSRFToken() {
            return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        }

        // Función principal para generar el PDF
        async function generatePDF() {
            const btn = document.getElementById('generatePdfBtn');
            const loading = document.getElementById('loading');
            
            // Parámetros hardcodeados
            const filters = {
                id_empresa: 1,
                id_almacen: 1,
                fechaInicio: '2024-01-01',
                fechaFin: '2024-12-31',
                status: 'activo'
            };
            
            console.log('Iniciando generación de PDF con parámetros:', filters);
            
            try {
                // Mostrar loading
                btn.disabled = true;
                btn.textContent = 'Generando...';
                loading.style.display = 'block';
                showMessage('', ''); // Limpiar mensajes
                
                // Crear URLSearchParams
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value);
                    }
                });
                
                console.log('Parámetros URL generados:', params.toString());
                
                // Hacer la petición al endpoint de Laravel
                const response = await fetch(`http://172.16.4.16:3000/warehouse/stock/mergepdf?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/pdf',
                        'X-CSRF-TOKEN': getCSRFToken(),
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                });
                
                console.log('Respuesta del servidor:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries())
                });
                
                if (response.ok) {
                    // Verificar si la respuesta es un PDF
                    const contentType = response.headers.get('content-type');
                    console.log('Tipo de contenido recibido:', contentType);
                    
                    if (contentType && contentType.includes('application/pdf')) {
                        // Descargar el PDF
                        const blob = await response.blob();
                        console.log('Blob PDF creado, tamaño:', blob.size, 'bytes');
                        
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `inventario-${new Date().toISOString().split('T')[0]}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        
                        console.log('PDF descargado exitosamente');
                        showMessage('success', 'PDF generado y descargado correctamente');
                    } else {
                        // Probablemente sea JSON con error
                        const data = await response.json();
                        console.log('Datos de respuesta (JSON):', data);
                        showMessage('error', data.message || 'Error desconocido');
                    }
                } else {
                    // Error en la respuesta
                    let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
                    
                    try {
                        const errorData = await response.json();
                        console.log('Datos de error:', errorData);
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        console.log('No se pudo parsear el error como JSON');
                    }
                    
                    console.error('Error en la petición:', errorMessage);
                    showMessage('error', errorMessage);
                }
                
            } catch (error) {
                console.error('Excepción capturada:', error);
                showMessage('error', `Error de conexión: ${error.message}`);
            } finally {
                // Restaurar el botón
                btn.disabled = false;
                btn.textContent = 'Generar PDF de Inventario';
                loading.style.display = 'none';
            }
        }

        // Agregar event listener al botón
        document.getElementById('generatePdfBtn').addEventListener('click', generatePDF);
        
        // Log inicial
        console.log('Vista de prueba de PDF cargada correctamente');
        console.log('Endpoint Laravel:', "{{ route('warehouse.stock.pdf') }}");
    </script>
</body>
</html>