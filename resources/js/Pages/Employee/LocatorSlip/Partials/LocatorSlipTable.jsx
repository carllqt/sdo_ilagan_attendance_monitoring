"use client";

import React from "react";

const LocatorSlipTable = ({ slips, onPreview }) => {
    return (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Employee
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Purpose
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Destination
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">
                        Date / Time
                    </th>
                    <th className="px-6 py-3 text-center font-medium text-gray-700">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {slips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3">
                            {slip.employee?.full_name || slip.employee?.name}
                        </td>
                        <td className="px-6 py-3">{slip.purpose_of_travel}</td>
                        <td className="px-6 py-3">{slip.destination}</td>
                        <td className="px-6 py-3">
                            {new Date(slip.date_time).toLocaleString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                            })}
                        </td>
                        <td className="px-6 py-3 text-center">
                            <button
                                onClick={() =>
                                    window.open(
                                        `/employee/locator-slip/pdf/${slip.id}`,
                                        "_blank",
                                    )
                                }
                                className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition"
                            >
                                Preview / PDF
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default LocatorSlipTable;
