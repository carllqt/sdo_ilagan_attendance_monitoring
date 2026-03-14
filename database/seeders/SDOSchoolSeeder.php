<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class SDOSchoolSeeder extends Seeder
{
public function run(): void
    {
        $rows = Excel::toArray([], database_path('seeders/data/sdo.xlsx'))[0];

        foreach ($rows as $i => $row) {
            if ($i === 0) continue; // skip header row

            $schoolName = trim((string) ($row[0] ?? ''));
            $schoolCode = trim((string) ($row[1] ?? ''));

            if ($schoolCode === '' && $schoolName === '') {
                continue;
            }

            if ($schoolCode === '' || $schoolName === '') {
                Log::warning('Skipping invalid school row', [
                    'row' => $i,
                    'data' => $row,
                ]);
                continue;
            }

            School::updateOrCreate(
                [
                    'school_code' => $schoolCode,
                ],
                [
                    'name'       => $schoolName,
                    'address'    => 'Ilagan City, Isabela',
                    'created_at' => now('Asia/Manila'),
                    'updated_at' => now('Asia/Manila'),
                ]
            );
        }
    }
}
