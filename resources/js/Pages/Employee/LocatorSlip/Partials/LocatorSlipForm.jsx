"use client";

import React from "react";
import { useForm } from "@inertiajs/react";

export default function LocatorSlipForm({ onClose, employee }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        purpose_of_travel: "",
        destination: "",
        date_time: "",
        check_type: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post("/employee/locator-slip", {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (err) => console.log(err),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="max-h-[90vh] w-[720px] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Locator Slip
                    </h2>
                    <p className="text-sm text-gray-500">
                        Fill out the details below
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Employee Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Name
                            </label>
                            <input
                                className="mt-1 w-full rounded-lg border bg-gray-100 p-2"
                                value={
                                    employee?.full_name || employee?.name || ""
                                }
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Position / Designation
                            </label>
                            <input
                                className="mt-1 w-full rounded-lg border bg-gray-100 p-2"
                                value={employee?.position || ""}
                                readOnly
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-600">
                                Permanent Station
                            </label>
                            <input
                                className="mt-1 w-full rounded-lg border bg-gray-100 p-2"
                                value={
                                    employee?.station ||
                                    employee?.permanent_station ||
                                    ""
                                }
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Purpose */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Purpose of Travel
                        </label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.purpose_of_travel}
                            onChange={(e) =>
                                setData("purpose_of_travel", e.target.value)
                            }
                        />
                        {errors.purpose_of_travel && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.purpose_of_travel}
                            </p>
                        )}
                    </div>

                    {/* Travel Type */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Travel Type
                        </label>
                        <div className="mt-2 flex gap-6">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="check_type"
                                    value="Official Business"
                                    checked={
                                        data.check_type === "Official Business"
                                    }
                                    onChange={(e) =>
                                        setData("check_type", e.target.value)
                                    }
                                />
                                Official Business
                            </label>

                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="check_type"
                                    value="Official Time"
                                    checked={
                                        data.check_type === "Official Time"
                                    }
                                    onChange={(e) =>
                                        setData("check_type", e.target.value)
                                    }
                                />
                                Official Time
                            </label>
                        </div>

                        {errors.check_type && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.check_type}
                            </p>
                        )}
                    </div>

                    {/* Date + Destination */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Date and Time
                            </label>
                            <input
                                type="datetime-local"
                                className="mt-1 w-full rounded-lg border p-2"
                                value={data.date_time}
                                onChange={(e) =>
                                    setData("date_time", e.target.value)
                                }
                            />
                            {errors.date_time && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.date_time}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Destination
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-lg border p-2"
                                value={data.destination}
                                onChange={(e) =>
                                    setData("destination", e.target.value)
                                }
                            />
                            {errors.destination && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.destination}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-3 border-t pt-4">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                            >
                                {processing ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
