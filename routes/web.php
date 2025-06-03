<?php

use App\Http\Controllers\PDFController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('main-view');
});

Route::get('/warehouse/stock/pdf', [PDFController::class, 'generateStockPDF'])
    ->name('warehouse.stock.pdf');
    
Route::get('/warehouse/stock/pdf/download', [PDFController::class, 'downloadStockPDF'])
    ->name('warehouse.stock.pdf.download');
