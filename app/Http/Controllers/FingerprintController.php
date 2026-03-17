<?php

namespace App\Http\Controllers;

use App\Models\Administrator\Employee;
use App\Models\Biometric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FingerprintController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'samples' => ['required', 'array', 'size:3'],
        ]);

        try {
            $employee = Employee::findOrFail($request->employee_id);

            $existingCount = Biometric::where('employee_id', $employee->id)->count();

            if ($existingCount >= 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'This employee already has 3 registered fingerprints.',
                ], 422);
            }

            $fingerIndex = $existingCount + 1;

            $normalizedTemplate = json_encode([
                'captures' => array_map(
                    fn($sample) => $this->normalizeSample($sample),
                    $request->samples
                ),
            ], JSON_UNESCAPED_SLASHES);

            Biometric::create([
                'employee_id' => $employee->id,
                'finger_index' => $fingerIndex,
                'fingerprint_template' => $normalizedTemplate,
            ]);

            if (isset($employee->available_fingers)) {
                $employee->available_fingers = max(3 - $fingerIndex, 0);
                $employee->save();
            }

            Log::info('Fingerprint registered', [
                'employee_id' => $employee->id,
                'finger_index' => $fingerIndex,
                'captures_count' => count($request->samples),
            ]);

            return response()->json([
                'success' => true,
                'message' => "Fingerprint {$fingerIndex} registered successfully with 3 scans.",
            ]);
        } catch (\Throwable $e) {
            Log::error('Fingerprint registration failed', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save fingerprint.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function test(Request $request)
    {
        $request->validate([
            'samples' => ['required', 'array', 'min:1'],
        ]);

        try {
            $sample = $request->samples[0];
            $normalizedSample = $this->normalizeSample($sample);

            Log::info('Fingerprint test incoming', [
                'sample_preview' => substr($normalizedSample, 0, 150),
                'sample_length' => strlen($normalizedSample),
            ]);

            $biometrics = Biometric::with('employee')->get();

            foreach ($biometrics as $biometric) {
                $storedTemplate = $this->normalizeStoredTemplate($biometric->fingerprint_template);

                Log::info('Comparing fingerprint', [
                    'biometric_id' => $biometric->id,
                    'employee_id' => $biometric->employee_id,
                    'stored_preview' => substr($storedTemplate, 0, 150),
                    'stored_length' => strlen($storedTemplate),
                    'is_equal' => $storedTemplate === $normalizedSample,
                ]);

                if ($storedTemplate === $normalizedSample) {
                    Log::info('Fingerprint matched', [
                        'employee_id' => $biometric->employee_id,
                        'employee_name' => trim(
                            $biometric->employee->first_name . ' ' .
                                ($biometric->employee->middle_name ?? '') . ' ' .
                                $biometric->employee->last_name
                        ),
                    ]);

                    return response()->json([
                        'success' => true,
                        'employee' => [
                            'first_name' => $biometric->employee->first_name,
                            'middle_name' => $biometric->employee->middle_name,
                            'last_name' => $biometric->employee->last_name,
                            'position' => $biometric->employee->position,
                            'department' => $biometric->employee->department,
                        ],
                    ]);
                }
            }

            Log::warning('No fingerprint match found');

            return response()->json([
                'success' => false,
                'message' => 'No matching fingerprint found.',
            ]);
        } catch (\Throwable $e) {
            Log::error('Fingerprint test failed', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Fingerprint test failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function normalizeSample($sample): string
    {
        // If sample is array/object, sort recursively and encode consistently
        if (is_array($sample)) {
            $sample = $this->sortRecursive($sample);
            return json_encode($sample, JSON_UNESCAPED_SLASHES);
        }

        if (is_string($sample)) {
            return trim($sample);
        }

        return json_encode($sample, JSON_UNESCAPED_SLASHES);
    }

    private function normalizeStoredTemplate($template): string
    {
        // handle BLOB/string safely
        if (is_resource($template)) {
            $template = stream_get_contents($template);
        }

        $template = (string) $template;
        $decoded = json_decode($template, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            $decoded = $this->sortRecursive($decoded);
            return json_encode($decoded, JSON_UNESCAPED_SLASHES);
        }

        return trim($template);
    }

    private function sortRecursive($data)
    {
        if (!is_array($data)) {
            return $data;
        }

        foreach ($data as $key => $value) {
            $data[$key] = $this->sortRecursive($value);
        }

        ksort($data);

        return $data;
    }
}
