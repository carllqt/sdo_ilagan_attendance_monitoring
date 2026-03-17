<?php

namespace Database\Seeders;

use App\Models\DepartmentHead;
use App\Models\User;
use App\Models\Administrator\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\Convertion;
use Database\Seeders\MonthlySeeder;
use Database\Seeders\LeaveCardSeeder;
use Database\Seeders\SDOSchoolSeeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(Convertion::class);

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $staff = Role::firstOrCreate(['name' => 'staff']);
        $employee1 = Employee::create([
            'first_name' => 'Reycarl',
            'middle_name' => 'Dela Cruz',
            'last_name' => 'Medico',
            'position' => 'Administrative Officer 5',
            'department' => 'ADMINISTRATIVE UNIT',
            'work_type' => 'Full',
        ]);
        $user1 = User::create([
            'name' => 'Staff',
            'email' => 'staff@gmail.com',
            'password' => Hash::make('123'),
            'employee_id' => $employee1->id,
        ]);
        $user1->assignRole($staff);
        Employee::factory(5)->create();


        $employee2 = Employee::create([
            'first_name' => 'Xedric',
            'middle_name' => 'Baingan',
            'last_name' => 'Alejo',
            'position' => 'Administrative Officer 5',
            'department' => 'ICT',
            'work_type' => 'Full',
        ]);
        $user2 = User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123'),
            'employee_id' => $employee2->id,
        ]);
        $user2->assignRole($admin);
        Employee::factory(5)->create();

        DepartmentHead::create([
            'department' => 'ict_unit',
            'employee_id' => $employee2->id,
            'status' => 'active',
        ]);

        $this->call([
            MonthlySeeder::class,
            LeaveCardSeeder::class,
            SDOSchoolSeeder::class,
        ]);
    }
}
