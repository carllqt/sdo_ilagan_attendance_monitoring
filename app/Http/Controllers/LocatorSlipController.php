<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Administrator\Employee;
use App\Models\LocatorSlip;
use Carbon\Carbon;

class LocatorSlipController extends Controller
{
    public function index()
    {
        $employee = Employee::first(); // ✅ ADD THIS BACK

        $locator_slips = LocatorSlip::with('employee')
            ->latest()
            ->get();

        return Inertia::render('Employee/LocatorSlip/LocatorSlipPage', [
            'locator_slips' => $locator_slips,
            'employee' => $employee, // ✅ now defined again
            'success_message' => session('success_message'),
            'error_message' => session('error_message'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purpose_of_travel' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'check_type' => 'required|string|in:Official Business,Official Time',
            'date_time' => 'required|date',
        ]);

        $employee = Employee::first(); // replace with logged-in employee later

        if (!$employee) {
            return redirect()
                ->route('locator-slips.index')
                ->with('error_message', 'No employee found in the system.');
        }

        LocatorSlip::create([
            'employee_id' => $employee->id,
            'purpose_of_travel' => $validated['purpose_of_travel'],
            'destination' => $validated['destination'],

            // ✅ BOOLEAN ONLY
            'official_business' => $validated['check_type'] === 'Official Business',
            'official_time' => $validated['check_type'] === 'Official Time',

            // ✅ DATETIME ONLY
            'date_time' => Carbon::parse($validated['date_time']),
        ]);

        return redirect()
            ->route('locator-slips.index')
            ->with('success_message', 'Locator Slip created successfully.');
    }
}
