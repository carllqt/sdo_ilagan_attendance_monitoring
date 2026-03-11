<?php

namespace App\Models\Administrator;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\HumanResource\TardyConvertion;
use App\Models\Biometric;
use App\Models\HumanResource\SickLeave;
use App\Models\HumanResource\VacationLeave;
use Database\Factories\EmployeeFactory;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'position',
        'department',
        'work_type',
        'active_status',
        'civil_status',
        'gsis_policy_no',
        'entrance_to_duty',
        'tin_no',
        'employment_status',
        'unit',
        'national_reference_card_no',
    ];

    protected $appends = ['full_name'];

    protected static function newFactory()
    {
        return EmployeeFactory::new();
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function tardyConvertion()
    {
        return $this->hasMany(TardyConvertion::class, 'employee_id');
    }

    public function biometric()
    {
        return $this->hasOne(Biometric::class, 'employee_id');
    }
    public function sickLeaves()
    {
        return $this->hasMany(SickLeave::class);
    }

    public function vacationLeaves()
    {
        return $this->hasMany(VacationLeave::class);
    }
    public function school(){
        return $this->belongsTo(School::class);
    }
}
