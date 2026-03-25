<?php

use App\Http\Controllers\VideoController;
use Illuminate\Support\Facades\Route;

Route::post('/v1/extract', [VideoController::class, 'extract'])->middleware('throttle:10,1');
Route::post('/v1/download', [VideoController::class, 'download'])->middleware('throttle:5,1');
