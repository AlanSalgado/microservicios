<?php

namespace App\Http\Controllers;

use App\Services\NodeJSApiService;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PDFController extends Controller
{
    protected $nodeApiService;

    public function __construct(NodeJSApiService $nodeApiService) {
        $this->nodeApiService = $nodeApiService;
    }

    public function generateStockPDF(Request $request)
    {
        // Validar parámetros
        $filters = $request->validate([
            'id_empresa' => 'nullable|integer',
            'id_almacen' => 'nullable|integer',
            'fechaInicio' => 'nullable|date',
            'fechaFin' => 'nullable|date',
            'id_producto' => 'nullable|integer',
            'clave' => 'nullable|string',
            'id_categoria' => 'nullable|integer',
            'status' => 'nullable|string'
        ]);

        try {
            $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMywibmFtZSI6IsOBbHZhcm8iLCJsYXN0bmFtZSI6IkZpZGFsZ28iLCJwaG9uZSI6IjQ2MTg1NDY5NTYiLCJlbWFpbCI6ImFsdmFyb0Bjb3JyZW8uY29tIiwicGFzc3dvcmQiOiIkMmEkMTIkajJ4N0QzTzM1RjVTbVc1YXdwUEppLmRYaWcyTzVDT2VnUW1kY3lXVzg4V2tONENoTlRmSE8iLCJzdGF0dXMiOjEsInJvbGVzIjpbeyJpZCI6MSwibmFtZSI6IkFkbWluaXN0cmF0b3IifV0sInRlbmFudHMiOlt7ImlkIjoxLCJjb25uZWN0aW9uX25hbWUiOiJDb25leGnDs24gVGVzdCJ9LHsiaWQiOjEyLCJjb25uZWN0aW9uX25hbWUiOiJTZXJ2aWNlT3JkZXJzIn0seyJpZCI6MTYsImNvbm5lY3Rpb25fbmFtZSI6IklUU0FMRVMgSVROUyBERU1PIn0seyJpZCI6MjIsImNvbm5lY3Rpb25fbmFtZSI6IlRSSU1BIn0seyJpZCI6MjMsImNvbm5lY3Rpb25fbmFtZSI6IklUU0FMRVMgUFJPRCJ9XX0sImlkX3RlbmFudCI6MTYsImlhdCI6MTc0ODk4MzI1OCwiZXhwIjoxNzQ4OTk0MDU4fQ.8DxpfJ20szTPU2YbNp_Mqt8L3i3_NGCbGqlx4MWY-V4";
            // Consumir la API de Node.js
            $apiResponse = $this->nodeApiService->getStockData($filters, $token);
            
            if (!$apiResponse['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $apiResponse['message']
                ], 400);
            }

            $data = $apiResponse['data'];
            
            // Obtener datos adicionales si es necesario
            $business = $this->getBusinessData($filters['id_empresa'] ?? null);
            $user = auth()->user()->name ?? $request->header('X-User-Name', 'Usuario');
            
            $dates = [
                'fechaInicio' => $filters['fechaInicio'] ?? date('Y-m-d'),
                'fechaFin' => $filters['fechaFin'] ?? date('Y-m-d')
            ];

            // Formatear fechas para mostrar
            $dates['fechaInicio'] = $this->formatDate($dates['fechaInicio']);
            $dates['fechaFin'] = $this->formatDate($dates['fechaFin']);

            // Generar PDF
            $pdf = Pdf::loadView('pdfs.warehouse-stock', compact('data', 'business', 'user', 'dates'))
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'dpi' => 150,
                    'defaultFont' => 'Arial',
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled' => true,
                ]);
            
            // Retornar el PDF como respuesta
            return $pdf->stream('inventario-' . date('Y-m-d') . '.pdf');

        } catch (\Exception $e) {
            \Log::error('Error generando PDF de inventario:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor al generar el PDF'
            ], 500);
        }
    }

    /**
     * Obtener datos de la empresa
     */
    private function getBusinessData($empresaId)
    {
        if (!$empresaId) {
            return $this->getDefaultBusinessData();
        }

        // Intentar obtener de la API de Node.js
        $businessData = $this->nodeApiService->getBusinessData($empresaId);
        
        if ($businessData) {
            return (object) $businessData;
        }

        // Datos por defecto si no se pueden obtener
        return $this->getDefaultBusinessData();
    }

    /**
     * Datos de empresa por defecto
     */
    private function getDefaultBusinessData()
    {
        return (object) [
            'RazonSocial' => 'MI EMPRESA',
            'Direccion' => 'Dirección no disponible',
            'Telefono' => 'Tel: N/A',
            'Web' => 'www.itnetworks.mx',
            'Imagen64' => null
        ];
    }

    /**
     * Formatear fecha para mostrar
     */
    private function formatDate($date)
    {
        try {
            return \Carbon\Carbon::parse($date)->format('d/m/Y');
        } catch (\Exception $e) {
            return date('d/m/Y');
        }
    }

    /**
     * Endpoint para descargar directamente el PDF
     */
    public function downloadStockPDF(Request $request)
    {
        $pdf = $this->generateStockPDF($request);
        
        if ($pdf instanceof \Illuminate\Http\JsonResponse) {
            return $pdf; // Error response
        }

        return $pdf->download('inventario-' . date('Y-m-d') . '.pdf');
    }
}
