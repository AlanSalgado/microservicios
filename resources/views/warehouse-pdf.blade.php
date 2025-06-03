<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inventario General</title>
    <style>
        @page {
            margin: 100px 50px 80px 50px;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 8pt;
            line-height: 1.2;
        }
        
        .header {
            position: fixed;
            top: -80px;
            left: 0;
            right: 0;
            height: 80px;
            border-bottom: 2px solid #003366;
        }
        
        .footer {
            position: fixed;
            bottom: -60px;
            left: 0;
            right: 0;
            height: 50px;
            border-top: 1px dotted #666;
            text-align: center;
            font-size: 7pt;
        }
        
        .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        
        .title {
            font-size: 12pt;
            font-weight: bold;
            text-decoration: underline;
            text-align: center;
        }
        
        .business-info {
            text-align: center;
            font-size: 8pt;
        }
        
        .business-logo {
            float: right;
            max-width: 150px;
            max-height: 60px;
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .table th {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 5px;
            text-align: center;
            font-weight: bold;
            font-size: 8pt;
        }
        
        .table td {
            border: 1px solid #ccc;
            padding: 3px 5px;
            font-size: 8pt;
        }
        
        .table td.number {
            text-align: right;
        }
        
        .table td.center {
            text-align: center;
        }
        
        .total-row {
            background-color: #f9f9f9;
            font-weight: bold;
        }
        
        .divider {
            border-top: 2px solid #003366;
            margin: 10px 0;
        }
        
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 20px;
        }
        
        .footer-left, .footer-right {
            font-size: 7pt;
            color: #20314F;
        }
        
        .footer-center {
            font-size: 10pt;
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div style="text-align: right; font-size: 8pt; margin-bottom: 5px;">
            {{ $business->Telefono ?? '' }}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="width: 50%;">
                <div class="title">INVENTARIOS</div>
                <div class="business-info">
                    <div>{{ $business->RazonSocial ?? '' }}</div>
                    <div style="font-size: 7pt;">{{ $business->Direccion ?? '' }}</div>
                </div>
            </div>
            
            @if(isset($business->Imagen64))
            <div style="width: 50%; text-align: right;">
                <img src="data:image/png;base64,{{ $business->Imagen64 }}" class="business-logo" alt="Logo">
            </div>
            @endif
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 8pt;">
            <div>ELABORÓ: {{ $user }}</div>
            <div>
                <a href="https://itnetworks.mx" style="color: black; text-decoration: underline;">
                    {{ $business->Web ?? 'www.itnetworks.mx' }}
                </a>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 8pt;">
            <div style="background-color: #f0f0f0; padding: 2px 5px; font-weight: bold;">GENERAL</div>
            <div>
                <span>DEL: {{ \Carbon\Carbon::parse($dates['fechaInicio'])->format('d/m/Y') }}</span>
                <span style="margin-left: 20px;">AL: {{ \Carbon\Carbon::parse($dates['fechaFin'])->format('d/m/Y') }}</span>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div style="border-top: 1px dotted #666; margin-bottom: 5px;"></div>
        <div style="text-align: center; font-size: 8pt; margin-bottom: 5px;">
            I N N O V A T I N G &nbsp;&nbsp; S O L U T I O N S
        </div>
        <div class="footer-content">
            <div class="footer-left">powered by IT NETWORKS www.itnetworks.mx Ver.12.49</div>
            <div class="footer-center">{{ now()->format('d/m/Y h:i:s A') }}</div>
            <div class="footer-right">Página <script type="text/php">
                if (isset($pdf)) {
                    $font = $fontMetrics->get_font("Arial", "normal");
                    $size = 10;
                    $pageText = $PAGE_NUM . " / " . $PAGE_COUNT;
                    $y = $pdf->get_height() - 35;
                    $x = $pdf->get_width() - 100;
                    $pdf->text($x, $y, $pageText, $font, $size);
                }
            </script></div>
        </div>
    </div>

    <!-- Content -->
    <div class="content" style="margin-top: 20px;">
        <div class="divider"></div>
        
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 13%;">Clave</th>
                    <th style="width: 35%;">Descripción</th>
                    <th style="width: 8%;">PSalida</th>
                    <th style="width: 11%;">Existencias</th>
                    <th style="width: 11%;">Disponibles</th>
                    <th style="width: 11%;">Físicas</th>
                    <th style="width: 11%;">Diferencia</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $countPS = 0;
                    $countExist = 0;
                @endphp
                
                @foreach($data as $item)
                    @php
                        $countPS += $item->PendienteSalida ?? 0;
                        $countExist += $item->existencia ?? 0;
                    @endphp
                    <tr>
                        <td>{{ $item->Clave ?? '' }}</td>
                        <td>{{ $item->Descripcion ?? '' }}</td>
                        <td class="number">{{ $item->PendienteSalida ?? 0 }}</td>
                        <td class="number">{{ $item->existencia ?? 0 }}</td>
                        <td class="number">{{ $item->PendienteEntrada ?? 0 }}</td>
                        <td class="center">___________</td>
                        <td class="center">___________</td>
                    </tr>
                @endforeach
                
                <!-- Total Row -->
                <tr class="total-row">
                    <td></td>
                    <td style="font-weight: bold;">TOTAL GENERAL</td>
                    <td class="number" style="font-weight: bold;">{{ $countPS }}</td>
                    <td class="number" style="font-weight: bold;">{{ $countExist }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        
        <div class="divider"></div>
    </div>
</body>
</html>