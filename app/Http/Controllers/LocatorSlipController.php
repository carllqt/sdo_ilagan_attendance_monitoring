<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Administrator\Employee;
use App\Models\LocatorSlip;
use Barryvdh\DomPDF\Facade\Pdf;

class LocatorSlipController extends Controller
{
    public function index()
    {
        $locator_slips = LocatorSlip::with('employee')->get();
        $employees = Employee::all();

        return Inertia::render('Employee/LocatorSlip/LocatorSlip', [
            'locator_slips' => $locator_slips,
            'employees' => $employees,
            'success_message' => session('success_message'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'purpose_of_travel' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'check_type' => 'required|string|in:Official Business,Official Time',
            'date_time' => 'required|date',
        ]);

        $employee = Employee::first(); // Sample employee for testing

        if (!$employee) {
            return Inertia::render('Employee/LocatorSlip/LocatorSlip', [
                'locator_slips' => LocatorSlip::with('employee')->get(),
                'employees' => Employee::all(),
                'error_message' => 'No employee found in the system.'
            ]);
        }

        LocatorSlip::create([
            'employee_id' => $employee->id,
            'purpose_of_travel' => $request->purpose_of_travel,
            'destination' => $request->destination,
            'check_type' => $request->check_type,
            'date_time' => $request->date_time,
        ]);

        return redirect()->route('locator-slips.index')
            ->with('success_message', 'Locator Slip created successfully.');
    }

    public function generatePDF($id)
    {
        $slip = LocatorSlip::with('employee')->findOrFail($id);

        $data = [
            'name' => $slip->employee->full_name,
            'position' => $slip->employee->position,
            'station' => $slip->employee->station,
            'purpose' => $slip->purpose_of_travel,
            'destination' => $slip->destination,
            'date_time' => date('F d, Y / h:i A', strtotime($slip->date_time)),
            'check_type' => $slip->check_type,
        ];

        $pdf = Pdf::loadView('pdf.locator-slip', $data)
    ->setPaper('A4', 'portrait');

    $pdf->getDomPDF()->set_option('isRemoteEnabled', true);
    $pdf->getDomPDF()->set_option('isHtml5ParserEnabled', true);
    $pdf->getDomPDF()->set_option('defaultFont', 'serif');

    return $pdf->stream();
    }
}