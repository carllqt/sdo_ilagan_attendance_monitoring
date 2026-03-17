"use client";

import React from "react";
import { useForm } from "@inertiajs/react";

export default function LocatorSlipForm({ onClose }) {
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white w-[720px] rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
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
                            <label className="text-sm text-gray-600 font-medium">
                                Name
                            </label>
                            <input
                                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
                                value="Maria Anita I. Espiritu"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 font-medium">
                                Position / Designation
                            </label>
                            <input
                                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
                                value="Administrative Officer II"
                                readOnly
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm text-gray-600 font-medium">
                                Permanent Station
                            </label>
                            <input
                                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
                                value="SDO City of Ilagan"
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
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={data.purpose_of_travel}
                            onChange={(e) =>
                                setData("purpose_of_travel", e.target.value)
                            }
                        />
                        {errors.purpose_of_travel && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.purpose_of_travel}
                            </p>
                        )}
                    </div>

                    {/* Travel Type */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Travel Type
                        </label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
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

                            <label className="flex items-center gap-2 cursor-pointer">
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
                            <p className="text-red-500 text-sm mt-1">
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
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={data.date_time}
                                onChange={(e) =>
                                    setData("date_time", e.target.value)
                                }
                            />
                            {errors.date_time && (
                                <p className="text-red-500 text-sm mt-1">
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
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={data.destination}
                                onChange={(e) =>
                                    setData("destination", e.target.value)
                                }
                            />
                            {errors.destination && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.destination}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-3 pt-4 border-t">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
