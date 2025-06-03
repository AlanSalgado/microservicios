<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NodeJSApiService
{
    protected $baseUrl;
    protected $timeout;

    public function __construct()
    {
        // $this->baseUrl = config('services.nodejs.base_url', 'http://172.16.4.16:3000');
        $this->baseUrl = 'http://172.16.4.16:3000';
        $this->timeout = config('services.nodejs.timeout', 30);
    }

    /**
     * Obtener datos de stock para PDF desde la API de Node.js
     */
    public function getStockData($filters = [], $token = null)
    {
        try {
            $paramMapping = [
                'id_empresa' => 'id_empresa',
                'id_almacen' => 'id_almacen',
                'fechaInicio' => 'fechaInicio',
                'fechaFin' => 'fechaFin',
                'id_producto' => 'id_producto',
                'clave' => 'clave',
                'id_categoria' => 'id_categoria',
                'status' => 'status'
            ];

            $params = [];
            foreach ($filters as $key => $value) {
                if ($value !== null && $value !== '' && isset($paramMapping[$key])) {
                    $params[$paramMapping[$key]] = $value;
                }
            }

            // Log de URL y parámetros que se enviarán
            $url = $this->baseUrl . '/warehouse/stock/mergepdf';
            Log::info('Llamando a Node.js API:', [
                'url' => $url,
                'params' => $params,
                'base_url' => $this->baseUrl,
                'token_presente' => !empty($token)
            ]);

            $httpClient = Http::timeout($this->timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json; charset=utf-8',
                    'Accept' => 'application/json; charset=utf-8'
                ])
                ->withOptions(['verify' => false]); // Solo si tienes problemas con SSL

            // Agregar cookie si está presente
            if ($token) {
                $httpClient = $httpClient->withCookies(['token' => $token], parse_url($this->baseUrl, PHP_URL_HOST));
                Log::info('Cookie token agregada para Node.js API');
            }

            $response = $httpClient->get($url, $params);

            // Log del status de respuesta
            Log::info('Status de respuesta Node.js:', [
                'status_code' => $response->status(),
                'successful' => $response->successful(),
                'headers' => $response->headers()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Datos exitosos de Node.js API:', [
                    'estructura_respuesta' => array_keys($data),
                    'total_data' => isset($data['data']) ? count($data['data']) : 0,
                    'respuesta_completa' => $data
                ]);
                
                return [
                    'success' => true,
                    'data' => $data['data'] ?? []
                ];
            } else {
                Log::error('Error en API Node.js:', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                
                return [
                    'success' => false,
                    'message' => $response->json()['message'] ?? 'Error al recuperar el inventario para el PDF'
                ];
            }

        } catch (\Exception $e) {
            Log::error('Excepción al consumir API Node.js:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'message' => 'Error en el servidor para PDF de inventario',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Obtener datos de empresa (si tienes este endpoint)
     */
    public function getBusinessData($empresaId, $token = null)
    {
        try {
            $httpClient = Http::timeout($this->timeout);
            
            if ($token) {
                $httpClient = $httpClient->withCookies(['token' => $token], parse_url($this->baseUrl, PHP_URL_HOST));
            }
            
            $response = $httpClient->get($this->baseUrl . '/business/' . $empresaId);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Error al obtener datos de empresa:', $e->getMessage());
            return null;
        }
    }

    /**
     * Método genérico para hacer peticiones GET a la API
     */
    public function get($endpoint, $params = [], $token = null)
    {
        try {
            $httpClient = Http::timeout($this->timeout);
            
            if ($token) {
                $httpClient = $httpClient->withCookies(['token' => $token], parse_url($this->baseUrl, PHP_URL_HOST));
            }
            
            $response = $httpClient->get($this->baseUrl . $endpoint, $params);

            return $response->json();
        } catch (\Exception $e) {
            Log::error("Error en GET {$endpoint}:", $e->getMessage());
            return null;
        }
    }

    /**
     * Método genérico para hacer peticiones POST a la API
     */
    public function post($endpoint, $data = [], $token = null)
    {
        try {
            $httpClient = Http::timeout($this->timeout);
            
            if ($token) {
                $httpClient = $httpClient->withCookies(['token' => $token], parse_url($this->baseUrl, PHP_URL_HOST));
            }
            
            $response = $httpClient->post($this->baseUrl . $endpoint, $data);

            return $response->json();
        } catch (\Exception $e) {
            Log::error("Error en POST {$endpoint}:", $e->getMessage());
            return null;
        }
    }
}