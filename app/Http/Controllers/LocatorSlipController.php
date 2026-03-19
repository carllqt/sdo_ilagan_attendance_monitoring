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
        $employee = Employee::with('station')->first();

        $locator_slips = LocatorSlip::with('employee.station')
            ->where('employee_id', $employee->id)
            ->latest()
            ->get();

        return Inertia::render('Employee/LocatorSlip/LocatorSlipPage', [
            'locator_slips' => $locator_slips,
            'employee' => $employee,
            'success_message' => session('success_message'),
            'error_message' => session('error_message'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'purpose_of_travel' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'travel_type' => 'required|in:official_business,official_time',
            'travel_datetime' => 'required|date',
        ]);

        LocatorSlip::create([
            'employee_id' => $validated['employee_id'],
            'purpose_of_travel' => $validated['purpose_of_travel'],
            'destination' => $validated['destination'],
            'travel_type' => $validated['travel_type'],
            'travel_datetime' => Carbon::parse($validated['travel_datetime']),
        ]);

        return redirect()
            ->route('locator-slips')
            ->with('success_message', 'Locator Slip created successfully.');
    }
}
