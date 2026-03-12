<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FingerprintController extends Controller
{
    public function test()
    {
        return Inertia::render('FingerprintTest');
    }
    // public function register(Request $request)
    // {
    //     try {
    //         Log::info('Fingerprint request received', $request->all());

    //         $validated = $request->validate([
    //             'employee_id' => ['required', 'integer'],
    //             'samples' => ['required'],
    //         ]);

    //         $employeeId = $validated['employee_id'];
    //         $samples = $validated['samples'];

    //         DB::table('employee_fingerprints')->insert([
    //             'employee_id' => $employeeId,
    //             'fingerprint_template' => json_encode($samples),
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Fingerprint registered successfully.',
    //         ]);
    //     } catch (\Throwable $e) {
    //         Log::error('Fingerprint register failed', [
    //             'message' => $e->getMessage(),
    //             'line' => $e->getLine(),
    //             'file' => $e->getFile(),
    //             'trace' => $e->getTraceAsString(),
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Server error: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function register(Request $request)
    {
        try {
            Log::info('Fingerprint request received', $request->all());

            $validated = $request->validate([
                'employee_id' => ['required', 'integer'],
                'samples' => ['required'],
            ]);

            $employeeId = $validated['employee_id'];
            $samples = $validated['samples'];

            Log::info('Fingerprint employee_id', [
                'employee_id' => $employeeId
            ]);

            Log::info('Fingerprint samples received', [
                'samples' => $samples
            ]);

            $preview = '';

            if (is_array($samples)) {
                Log::info('First fingerprint sample', [
                    'sample_0' => $samples[0] ?? null
                ]);

                $preview = isset($samples[0])
                    ? substr(json_encode($samples[0]), 0, 200)
                    : '';
            } else {
                $preview = substr((string) $samples, 0, 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Fingerprint received (debug mode).',
                'employee_id' => $employeeId,
                'samples_count' => is_array($samples) ? count($samples) : 1,
                'samples_preview' => $preview,
                'samples_raw' => $samples,
            ]);
        } catch (\Throwable $e) {
            Log::error('Fingerprint register failed', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
