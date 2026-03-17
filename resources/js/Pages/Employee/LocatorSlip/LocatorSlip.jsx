"use client";

import React, { useState } from "react";
import LocatorSlipForm from "./Partials/LocatorSlipForm";
import LocatorSlipTable from "./Partials/LocatorSlipTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function LocatorSlipPage({
    locator_slips,
    employees,
    success_message,
}) {
    const [showForm, setShowForm] = useState(false);

    const handlePreview = (id) => {
        window.open(`/employee/locator-slip/pdf/${id}`, "_blank");
    };

    return (
        <AuthenticatedLayout header="Locator Slips">
            <div className="p-6">
                {success_message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                        {success_message}
                    </div>
                )}

                <button
                    onClick={() => setShowForm(true)}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Add Locator Slip
                </button>

                {showForm && (
                    <LocatorSlipForm onClose={() => setShowForm(false)} />
                )}

                <LocatorSlipTable
                    slips={locator_slips}
                    onPreview={handlePreview}
                />
            </div>
        </AuthenticatedLayout>
    );
}
