import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import EmployeeRegistration from "./Partials/EmployeeRegistration";
import EmployeeList from "./Partials/EmployeeList";
import EmployeeEditDialog from "./Partials/EmployeeEditDialog";
import axios from "axios";
axios.defaults.headers.common["X-CSRF-TOKEN"] = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const EmployeeManagement = ({
    employeesList,
    registeredList,
    unregisteredList,
}) => {
    const [search, setSearch] = useState("");

    const [employees, setEmployees] = useState(employeesList || []);
    const [registered, setRegistered] = useState(registeredList || []);
    const [unregistered, setUnregistered] = useState(unregisteredList || []);
    const [registrationSamples, setRegistrationSamples] = useState([]);
    const [enrollmentScans, setEnrollmentScans] = useState([]);

    const [selectedEmployee, setSelectedEmployee] = useState("");
    const selectedEmployeeRef = useRef(null);
    const employeesRef = useRef(employees);
    const [scanStatus, setScanStatus] = useState("idle");
    const [scanMessage, setScanMessage] = useState("");
    const [scanning, setScanning] = useState(false);

    const scanModeRef = useRef(null);
    const [scanMode, setScanMode] = useState(null);
    const testOpenRef = useRef(false);
    <s></s>;
    const [open, setOpen] = useState(false);

    const [testEmployee, setTestEmployee] = useState(null);
    const [testCountdown, setTestCountdown] = useState(null);
    const [testOpen, setTestOpen] = useState(false);
    const [testMessage, setTestMessage] = useState("Waiting for scan...");
    const [testStatus, setTestStatus] = useState("idle");

    const [selectedDepartment, setSelectedDepartment] =
        useState("All Departments");
    const departments = [
        "All Departments",
        ...new Set(employees.map((e) => e.department)),
    ];

    const apiRef = useRef(null);

    useEffect(() => {
        selectedEmployeeRef.current = selectedEmployee;
    }, [selectedEmployee]);

    useEffect(() => {
        employeesRef.current = employees;
    }, [employees]);

    useEffect(() => {
        testOpenRef.current = testOpen;
    }, [testOpen]);

    const [statusFilter, setStatusFilter] = useState("Active");
    const statusOptions = ["Active", "Inactive"];

    useEffect(() => {
        scanModeRef.current = scanMode;
    }, [scanMode]);

    // Initialize employees from props
    useEffect(() => {
        setEmployees(Array.isArray(employeesList) ? employeesList : []);
    }, [employeesList]);

    useEffect(() => {
        setRegistered(employees.filter((emp) => emp.available_fingers < 3));
        setUnregistered(employees.filter((emp) => emp.available_fingers === 3));
    }, [employees]);

    const getFingerprintColor = () => {
        switch (scanStatus) {
            case "scanning":
                return "text-blue-500 animate-pulse";
            case "success":
                return "text-green-500 animate-bounce";
            case "error":
                return "text-red-500";
            default:
                return "text-gray-400";
        }
    };

    const isRegistered = (id) => registered?.some((reg) => reg.id === id);

    const availableFingers = (empId) => {
        const emp = employees.find((e) => e.id === empId);
        return emp ? emp.available_fingers : 3;
    };

    // Reset UI after success
    useEffect(() => {
        let timer;
        if (scanStatus === "success") {
            timer = setTimeout(() => {
                setScanning(false);
                setScanStatus("idle");
                setScanMessage("Place your fingerprint");
                setSelectedEmployee("");
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [scanStatus]);

    const startEnrollment = async () => {
        if (!selectedEmployeeRef.current) {
            setScanStatus("error");
            setScanMessage("❌ Please select an employee first.");
            return;
        }

        if (!apiRef.current) {
            setScanStatus("error");
            setScanMessage("❌ Fingerprint API not initialized.");
            return;
        }

        try {
            setRegistrationSamples([]);
            setScanMode("register");
            setScanning(true);
            setScanStatus("scanning");
            setScanMessage(
                "Scan 1 of 3. Place the SAME finger on the scanner...",
            );

            await apiRef.current.stopAcquisition().catch(() => {});

            await apiRef.current.startAcquisition(
                window.Fingerprint.SampleFormat.Intermediate,
            );
        } catch (error) {
            console.error("Failed to start enrollment:", error);
            setScanStatus("error");
            setScanMessage("❌ Failed to start fingerprint scanner.");
            setScanning(false);
        }
    };

    const cancelScan = async () => {
        try {
            if (apiRef.current) {
                await apiRef.current.stopAcquisition();
            }
        } catch (error) {
            console.error("Failed to stop acquisition:", error);
        }

        setRegistrationSamples([]);
        setScanning(false);
        setScanStatus("idle");
        setScanMessage("Scan cancelled");
        setScanMode(null);
    };

    useEffect(() => {
        if (!window.Fingerprint || !window.Fingerprint.WebApi) {
            setScanStatus("error");
            setScanMessage("❌ Fingerprint SDK not loaded.");
            return;
        }

        const api = new window.Fingerprint.WebApi();
        apiRef.current = api;

        api.onDeviceConnected = () => {
            console.log("Fingerprint reader connected");
        };

        api.onDeviceDisconnected = () => {
            console.log("Fingerprint reader disconnected");
            setScanStatus("error");
            setScanMessage("❌ Fingerprint reader disconnected.");
            setScanning(false);
        };

        api.onCommunicationFailed = () => {
            console.error("Communication failed");
            setScanStatus("error");
            setScanMessage(
                "❌ Cannot connect to fingerprint device. Check ADC.",
            );
            setScanning(false);
        };

        api.onAcquisitionStarted = () => {
            setScanStatus("scanning");
            setScanMessage(
                "🔄 Scanner started. Place your finger on the reader...",
            );
        };

        api.onAcquisitionStopped = () => {
            console.log("Fingerprint acquisition stopped");
        };

        api.onQualityReported = (event) => {
            console.log("Quality reported:", event);
            setScanStatus("scanning");
            setScanMessage("🔄 Finger detected. Processing sample...");
        };

        api.onErrorOccurred = (event) => {
            console.error("Fingerprint error:", event);
            setScanStatus("error");
            setScanMessage(
                `❌ ${event?.message || "Fingerprint reader error occurred."}`,
            );
            setScanning(false);
        };

        api.onSamplesAcquired = async (event) => {
            console.log("onSamplesAcquired fired");
            console.log("Current mode:", scanModeRef.current);
            console.log("Raw sample event:", event);

            const samples = JSON.parse(event.samples);
            console.log("Parsed samples:", samples);

            if (scanModeRef.current === "register") {
                try {
                    const newSample = samples[0];
                    const updated = [...registrationSamples, newSample];
                    const count = updated.length;

                    setRegistrationSamples(updated);

                    console.log(`Registration sample ${count}/3 captured`);

                    if (count < 3) {
                        setScanStatus("scanning");
                        setScanMessage(
                            `✅ Scan ${count} of 3 captured. Place the SAME finger again...`,
                        );
                        return;
                    }

                    setScanStatus("scanning");
                    setScanMessage(
                        "🔄 3 scans captured. Saving fingerprint...",
                    );

                    await apiRef.current.stopAcquisition();

                    const response = await axios.post("/fingerprint/register", {
                        employee_id: selectedEmployeeRef.current,
                        samples: updated,
                    });

                    console.log("Register response:", response.data);

                    if (response.data.success) {
                        setScanStatus("success");
                        setScanMessage(response.data.message);
                        setScanning(false);

                        setEmployees((prevEmployees) =>
                            prevEmployees.map((e) =>
                                e.id === selectedEmployeeRef.current
                                    ? {
                                          ...e,
                                          available_fingers: Math.max(
                                              e.available_fingers - 1,
                                              0,
                                          ),
                                      }
                                    : e,
                            ),
                        );

                        setRegistrationSamples([]);
                    } else {
                        setScanStatus("error");
                        setScanMessage(
                            response.data.message ||
                                "❌ Failed to register fingerprint.",
                        );
                        setScanning(false);
                        setRegistrationSamples([]);
                    }
                } catch (err) {
                    console.error("Failed to save fingerprint:", err);
                    console.error(
                        "Register error response:",
                        err.response?.data,
                    );

                    setScanStatus("error");
                    setScanMessage(
                        err.response?.data?.message ||
                            "❌ Unexpected error occurred while saving fingerprint.",
                    );
                    setScanning(false);
                    setRegistrationSamples([]);

                    try {
                        await apiRef.current.stopAcquisition();
                    } catch {}
                }

                return;
            }

            if (scanModeRef.current === "test") {
                try {
                    setTestStatus("scanning");
                    setTestMessage("🔄 Fingerprint captured. Matching...");

                    const response = await axios.post("/fingerprint/test", {
                        samples,
                    });

                    const data = response.data;
                    console.log("Test response:", data);

                    if (data.success && data.employee) {
                        console.log(
                            "MATCHED EMPLOYEE:",
                            `${data.employee.first_name} ${data.employee.middle_name ?? ""} ${data.employee.last_name}`,
                        );
                        console.log("Department:", data.employee.department);
                        console.log("Position:", data.employee.position);

                        const {
                            first_name,
                            middle_name,
                            last_name,
                            position,
                            department,
                        } = data.employee;

                        setTestEmployee({
                            first_name,
                            middle_name,
                            last_name,
                            position,
                            department,
                        });

                        setTestStatus("success");
                        setTestMessage(
                            `✅ Match: ${first_name} ${last_name} (${department} - ${position})`,
                        );
                    } else {
                        console.log("No fingerprint match found");
                        setTestEmployee(null);
                        setTestStatus("error");
                        setTestMessage(
                            data.message || "❌ No matching fingerprint found.",
                        );
                    }

                    await apiRef.current.stopAcquisition();

                    let count = 3;
                    setTestCountdown(count);

                    const interval = setInterval(() => {
                        count -= 1;
                        setTestCountdown(count);

                        if (count <= 0) {
                            clearInterval(interval);
                            setTestCountdown(null);
                            setTestEmployee(null);
                            setTestStatus("scanning");
                            setTestMessage(
                                "Place your finger on the scanner...",
                            );

                            if (testOpenRef.current) {
                                startTestFingerprint();
                            }
                        }
                    }, 1000);
                } catch (err) {
                    console.error("Test fingerprint failed:", err);
                    console.error("Test error response:", err.response?.data);

                    setTestEmployee(null);
                    setTestStatus("error");
                    setTestMessage(
                        err.response?.data?.message ||
                            "❌ Test fingerprint failed.",
                    );

                    try {
                        await apiRef.current.stopAcquisition();
                    } catch {}

                    let count = 3;
                    setTestCountdown(count);

                    const interval = setInterval(() => {
                        count -= 1;
                        setTestCountdown(count);

                        if (count <= 0) {
                            clearInterval(interval);
                            setTestCountdown(null);
                            setTestEmployee(null);
                            setTestStatus("scanning");
                            setTestMessage(
                                "Place your finger on the scanner...",
                            );

                            if (testOpenRef.current) {
                                startTestFingerprint();
                            }
                        }
                    }, 1000);
                }
            }
        };

        return () => {
            if (apiRef.current) {
                apiRef.current.stopAcquisition().catch(() => {});
            }
        };
    }, []);

    const registerFingerprint = async () => {
        if (!selectedEmployee) return;

        if (!apiRef.current) {
            setScanStatus("error");
            setScanMessage("❌ Fingerprint API not initialized.");
            return;
        }

        try {
            setScanMode("register");
            setRegistrationSamples([]);
            setScanning(true);
            setScanStatus("scanning");
            setScanMessage(
                "🔄 Scan 1 of 3. Place the same finger on the scanner...",
            );

            await apiRef.current.startAcquisition(
                window.Fingerprint.SampleFormat.Intermediate,
            );
        } catch (error) {
            console.error("Failed to start acquisition:", error);
            setScanStatus("error");
            setScanMessage("❌ Failed to start fingerprint scanner.");
            setScanning(false);
        }
    };

    const cancelTestFingerprint = async () => {
        try {
            if (apiRef.current) {
                await apiRef.current.stopAcquisition();
            }
        } catch (error) {
            console.error("Failed to stop test acquisition:", error);
        }

        setScanMode(null);
        setTestEmployee(null);
        setTestCountdown(null);
        setTestStatus("idle");
        setTestMessage("Waiting for scan...");
    };

    const startTestFingerprint = async () => {
        if (!apiRef.current) {
            setTestStatus("error");
            setTestMessage("❌ Fingerprint API not initialized.");
            return;
        }

        try {
            try {
                await apiRef.current.stopAcquisition();
            } catch {}

            console.log("Starting test acquisition...");
            setScanMode("test");
            setTestEmployee(null);
            setTestCountdown(null);
            setTestStatus("scanning");
            setTestMessage("Place your finger on the scanner...");

            await apiRef.current.startAcquisition(
                window.Fingerprint.SampleFormat.Intermediate,
            );

            console.log("Test acquisition started");
        } catch (error) {
            console.error("Failed to start test acquisition:", error);
            setTestStatus("error");
            setTestMessage("❌ Failed to start fingerprint scanner.");
        }
    };

    const fingerOptions = [
        { value: 1, label: "Finger 1" },
        { value: 2, label: "Finger 2" },
        { value: 3, label: "Finger 3" },
    ];

    const [form, setForm] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
        department: "",
        work_type: "",
    });

    const [editOpen, setEditOpen] = useState(false);

    const [editForm, setEditForm] = useState(null);

    const handleEdit = (employee) => {
        setEditForm({
            id: employee.id,
            first_name: employee.first_name,
            middle_name: employee.middle_name,
            last_name: employee.last_name,
            position: employee.position,
            department: employee.department,
            work_type: employee.work_type,
            active_status: employee.active_status,
        });
        setEditOpen(true);
    };

    const department_choices = [
        "CID",
        "SGOD",
        "HRMO",
        "ADMINISTRATIVE UNIT",
        "CASH UNIT",
        "BUDGET UNIT",
        "ACCOUNTING UNIT",
        "RECORDS UNIT",
        "SDS OFFICE",
        "ICT UNIT",
        "SUPPLY UNIT",
    ];

    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch =
            emp.first_name.toLowerCase().includes(search.toLowerCase()) ||
            emp.last_name.toLowerCase().includes(search.toLowerCase()) ||
            (emp.position &&
                emp.position.toLowerCase().includes(search.toLowerCase())) ||
            (emp.department &&
                emp.department.toLowerCase().includes(search.toLowerCase()));

        // Department filter
        const matchesDepartment =
            selectedDepartment === "All Departments"
                ? true
                : emp.department === selectedDepartment;

        // Status filter
        const matchesStatus =
            statusFilter === "All Status"
                ? true
                : statusFilter === "Active"
                  ? emp.active_status === "Active" || emp.active_status === 1
                  : emp.active_status === "Inactive" || emp.active_status === 0;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    return (
        <AuthenticatedLayout header="Employee Management">
            <Head title="AMS" />
            <main>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <EmployeeRegistration />

                    <div className="bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-2xl p-6 border border-gray-100 flex flex-col">
                        <h2 className="text-l font-bold text-gray-800 mb-1 flex items-center gap-2">
                            <Fingerprint className="w-6 h-6 text-blue-600" />
                            Employee Fingerprint Registration
                        </h2>

                        <div className="flex flex-col items-center gap-4">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="cyan"
                                        role="combobox"
                                        className="justify-between"
                                    >
                                        {employees.find(
                                            (emp) =>
                                                emp.id === selectedEmployee,
                                        )?.full_name || "-- Choose Employee --"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-3">
                                    <Command>
                                        <CommandInput placeholder="Search employee..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                No employee found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {employees
                                                    .filter(
                                                        (emp) =>
                                                            availableFingers(
                                                                emp.id,
                                                            ) > 0,
                                                    )
                                                    .map((emp) => (
                                                        <CommandItem
                                                            key={emp.id}
                                                            onSelect={() => {
                                                                setSelectedEmployee(
                                                                    emp.id,
                                                                );
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            {emp.full_name} (
                                                            {availableFingers(
                                                                emp.id,
                                                            )}{" "}
                                                            finger
                                                            {availableFingers(
                                                                emp.id,
                                                            ) !== 1
                                                                ? "s"
                                                                : ""}{" "}
                                                            available)
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <div className="flex flex-col items-center justify-center text-center">
                                <Fingerprint
                                    className={`w-20 h-20 transition-all duration-300 mt-5 ${getFingerprintColor()}`}
                                />
                                <p
                                    className={`text-sm font-semibold mt-4 min-h-[1.25rem] ${
                                        scanStatus === "error"
                                            ? "text-red-500"
                                            : scanStatus === "success"
                                              ? "text-green-500"
                                              : "text-blue-500"
                                    }`}
                                >
                                    {scanStatus === "error"
                                        ? scanMessage
                                        : scanStatus === "success"
                                          ? scanMessage
                                          : scanning
                                            ? scanMessage
                                            : selectedEmployee
                                              ? `${availableFingers(
                                                    selectedEmployee,
                                                )} Available Fingerprint${
                                                    availableFingers(
                                                        selectedEmployee,
                                                    ) !== 1
                                                        ? "s"
                                                        : ""
                                                } Registration`
                                              : ""}
                                </p>
                            </div>

                            <div className="cursor-pointer w-full flex justify-center gap-4">
                                <Button
                                    variant={scanning ? "cyan" : "green"}
                                    onClick={() => {
                                        if (scanning) cancelScan();
                                        else if (scanStatus === "success") {
                                            setScanning(false);
                                            setScanStatus("idle");
                                            setScanMessage(
                                                "Place your fingerprint",
                                            );
                                            setSelectedEmployee("");
                                            setRegistrationSamples([]);
                                        } else if (scanStatus === "error") {
                                            startEnrollment();
                                        } else {
                                            startEnrollment();
                                        }
                                    }}
                                    disabled={!selectedEmployee}
                                    className="w-60 mt-1"
                                >
                                    {scanning
                                        ? "Cancel"
                                        : scanStatus === "success"
                                          ? "Register Another"
                                          : scanStatus === "error"
                                            ? "Retry"
                                            : "Register Fingerprint"}
                                </Button>
                                <AlertDialog
                                    open={testOpen}
                                    onOpenChange={(open) => {
                                        setTestOpen(open);

                                        if (open) {
                                            startTestFingerprint();
                                        } else {
                                            cancelTestFingerprint();
                                        }
                                    }}
                                >
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="blue"
                                            className="w-60 mt-1"
                                        >
                                            Test Fingerprint
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Test Fingerprint
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Place your finger on the
                                                scanner. It will check against
                                                registered employees.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <div className="flex flex-col items-center py-4 w-full">
                                            <Fingerprint
                                                className={`w-20 h-20 ${
                                                    testStatus === "scanning"
                                                        ? "text-blue-500 animate-pulse"
                                                        : testStatus ===
                                                            "success"
                                                          ? "text-green-500 animate-bounce"
                                                          : testStatus ===
                                                              "error"
                                                            ? "text-red-500"
                                                            : "text-gray-400"
                                                }`}
                                            />

                                            <p className="mt-3 text-sm text-gray-700 text-center">
                                                {testMessage}
                                            </p>

                                            {testCountdown !== null && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Resetting in {testCountdown}
                                                    ...
                                                </p>
                                            )}

                                            {testEmployee && (
                                                <div className="mt-4 w-full rounded-xl border border-green-200 bg-green-50 p-4 text-left">
                                                    <p className="font-bold text-green-700 mb-2">
                                                        Registered Employee
                                                        Found
                                                    </p>

                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-semibold">
                                                            Name:
                                                        </span>{" "}
                                                        {
                                                            testEmployee.first_name
                                                        }{" "}
                                                        {testEmployee.middle_name
                                                            ? `${testEmployee.middle_name} `
                                                            : ""}
                                                        {testEmployee.last_name}
                                                    </p>

                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-semibold">
                                                            Department:
                                                        </span>{" "}
                                                        {
                                                            testEmployee.department
                                                        }
                                                    </p>

                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-semibold">
                                                            Position:
                                                        </span>{" "}
                                                        {testEmployee.position}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                onClick={cancelTestFingerprint}
                                            >
                                                Close
                                            </AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </div>

                <EmployeeList
                    filteredEmployees={filteredEmployees}
                    isRegistered={isRegistered}
                    handleEdit={handleEdit}
                    search={search}
                    setSearch={setSearch}
                    departments={departments}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                    statusOptions={statusOptions}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <EmployeeEditDialog
                    editForm={editForm}
                    setEditForm={setEditForm}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    department_choices={department_choices}
                />
            </main>
        </AuthenticatedLayout>
    );
};

export default EmployeeManagement;
