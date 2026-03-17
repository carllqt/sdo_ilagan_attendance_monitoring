import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FingerprintReader, SampleFormat } from "@digitalpersona/devices";

export default function Fingerprint() {
    const readerRef = useRef(null);

    const [samples, setSamples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [deviceReady, setDeviceReady] = useState(false);
    const [quality, setQuality] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("Reader not initialized.");

    useEffect(() => {
        let mounted = true;

        const onDeviceConnected = () => {
            if (!mounted) return;
            setDeviceReady(true);
            setError("");
            setStatus("Fingerprint reader connected.");
        };

        const onDeviceDisconnected = () => {
            if (!mounted) return;
            setDeviceReady(false);
            setCapturing(false);
            setStatus("Fingerprint reader disconnected.");
        };

        const onQualityReported = (event) => {
            if (!mounted) return;
            setQuality(event?.quality ?? null);
        };

        const onErrorOccurred = (event) => {
            console.error("Reader error:", event);
            if (!mounted) return;
            setCapturing(false);
            setError("Fingerprint reader error occurred.");
            setStatus("Reader error.");
        };

        const onSamplesAcquired = async (event) => {
            try {
                const acquired = event?.samples;

                if (!acquired) {
                    setError("No fingerprint sample received.");
                    return;
                }

                let parsedSamples = acquired;

                if (typeof acquired === "string") {
                    try {
                        parsedSamples = JSON.parse(acquired);
                    } catch {
                        parsedSamples = [acquired];
                    }
                }

                const firstSample = Array.isArray(parsedSamples)
                    ? parsedSamples[0]
                    : parsedSamples;

                if (!firstSample) {
                    setError("Received empty fingerprint sample.");
                    return;
                }

                let shouldStop = false;

                setSamples((prev) => {
                    if (prev.length >= 3) return prev;

                    const next = [...prev, firstSample];

                    if (next.length >= 3) {
                        shouldStop = true;
                    }

                    return next;
                });

                setError("");
                setStatus("Fingerprint sample captured.");

                if (shouldStop) {
                    await stopCapture();
                    setStatus("3 samples captured. Ready for verification.");
                }
            } catch (err) {
                console.error("onSamplesAcquired error:", err);
                setError("Failed to process captured fingerprint sample.");
            }
        };

        const initReader = async () => {
            try {
                const reader = new FingerprintReader();
                readerRef.current = reader;

                reader.on("DeviceConnected", onDeviceConnected);
                reader.on("DeviceDisconnected", onDeviceDisconnected);
                reader.on("QualityReported", onQualityReported);
                reader.on("SamplesAcquired", onSamplesAcquired);
                reader.on("ErrorOccurred", onErrorOccurred);

                if (mounted) {
                    setStatus("Fingerprint reader initialized.");
                }
            } catch (err) {
                console.error(err);
                if (mounted) {
                    setError(
                        "Failed to initialize fingerprint reader. Make sure DigitalPersona WebSDK/Lite Client is available.",
                    );
                    setStatus("Reader initialization failed.");
                }
            }
        };

        initReader();

        return () => {
            mounted = false;

            const reader = readerRef.current;
            if (reader) {
                try {
                    reader.off("DeviceConnected", onDeviceConnected);
                    reader.off("DeviceDisconnected", onDeviceDisconnected);
                    reader.off("QualityReported", onQualityReported);
                    reader.off("SamplesAcquired", onSamplesAcquired);
                    reader.off("ErrorOccurred", onErrorOccurred);
                    reader.stopAcquisition?.();
                } catch (e) {
                    console.warn("Reader cleanup warning:", e);
                }
            }
        };
    }, []);

    const startCapture = async () => {
        try {
            setError("");
            setResult(null);
            setStatus("Waiting for fingerprint...");
            setCapturing(true);

            if (!readerRef.current) {
                throw new Error("Fingerprint reader is not initialized.");
            }

            await readerRef.current.startAcquisition(SampleFormat.Intermediate);
        } catch (err) {
            console.error(err);
            setCapturing(false);
            setError(
                "Cannot start capture. Make sure the DigitalPersona client/agent is installed and the reader is connected.",
            );
            setStatus("Failed to start capture.");
        }
    };

    const stopCapture = async () => {
        try {
            if (readerRef.current) {
                await readerRef.current.stopAcquisition();
            }
        } catch (err) {
            console.warn("stopAcquisition warning:", err);
        } finally {
            setCapturing(false);
        }
    };

    const resetSamples = async () => {
        await stopCapture();
        setSamples([]);
        setResult(null);
        setError("");
        setQuality(null);
        setStatus("Ready to capture fingerprint.");
    };

    const handleTestThree = async () => {
        if (samples.length !== 3) {
            setError("You must capture exactly 3 fingerprint scans.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);
            setStatus("Verifying fingerprint...");

            const response = await axios.post(route("fingerprint.testThree"), {
                samples,
            });

            setResult(response.data);
            setStatus("Verification complete.");
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message || "Failed to test fingerprint.",
            );
            setStatus("Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 rounded-xl border p-4">
            <div>
                <h2 className="text-lg font-semibold">Fingerprint Test</h2>
                <p className="text-sm text-gray-500">
                    Capture 3 real scans from the DigitalPersona reader and
                    compare scan 2 and 3 against scan 1.
                </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Reader</p>
                    <p className="text-sm font-medium">
                        {deviceReady ? "Connected" : "Not Connected"}
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-medium">{status}</p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Captured Scans</p>
                    <p className="text-sm font-medium">{samples.length} / 3</p>
                </div>
            </div>

            {quality !== null && (
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                    Quality reported: {String(quality)}
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={startCapture}
                    disabled={capturing || samples.length >= 3}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {capturing ? "Capturing..." : "Start Capture"}
                </button>

                <button
                    type="button"
                    onClick={stopCapture}
                    disabled={!capturing}
                    className="rounded-md bg-amber-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    Stop Capture
                </button>

                <button
                    type="button"
                    onClick={handleTestThree}
                    disabled={loading || samples.length !== 3}
                    className="rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {loading ? "Testing..." : "Verify Fingerprint"}
                </button>

                <button
                    type="button"
                    onClick={resetSamples}
                    className="rounded-md bg-gray-500 px-4 py-2 text-white"
                >
                    Reset
                </button>
            </div>

            <div className="rounded-lg border p-3">
                <p className="mb-2 text-sm font-medium">Scan Progress</p>
                <div className="flex gap-2">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                                samples.length >= n
                                    ? "border-green-600 bg-green-100 text-green-700"
                                    : "border-gray-300 bg-gray-50 text-gray-500"
                            }`}
                        >
                            {n}
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {result && (
                <div className="rounded-xl border p-4">
                    <h3 className="mb-3 text-base font-semibold">
                        Capture Diagnostic
                    </h3>

                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            {result.result?.ready_for_enrollment ? (
                                <span className="font-semibold text-green-600">
                                    Ready for Enrollment
                                </span>
                            ) : (
                                <span className="font-semibold text-red-600">
                                    Capture Incomplete
                                </span>
                            )}
                        </p>

                        <p>
                            <span className="font-medium">Message:</span>{" "}
                            {result.message}
                        </p>

                        <p>
                            <span className="font-medium">
                                Captured Samples:
                            </span>{" "}
                            {result.result?.capture_count ?? 0} / 3
                        </p>

                        <p>
                            <span className="font-medium">
                                All Samples Received:
                            </span>{" "}
                            {result.result?.all_received ? "Yes" : "No"}
                        </p>

                        <p>
                            <span className="font-medium">Same Version:</span>{" "}
                            {result.result?.same_version ? "Yes" : "No"}
                        </p>

                        <p>
                            <span className="font-medium">Same Type:</span>{" "}
                            {result.result?.same_type ? "Yes" : "No"}
                        </p>

                        <p>
                            <span className="font-medium">
                                Same Format Owner:
                            </span>{" "}
                            {result.result?.same_format_owner ? "Yes" : "No"}
                        </p>

                        <p>
                            <span className="font-medium">Same Format ID:</span>{" "}
                            {result.result?.same_format_id ? "Yes" : "No"}
                        </p>

                        <div className="mt-4 space-y-3">
                            {(result.result?.samples || []).map(
                                (sample, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg bg-gray-50 p-3"
                                    >
                                        <p className="font-medium">
                                            Sample {index + 1}
                                        </p>
                                        <p>Length: {sample.data_length}</p>
                                        <p>
                                            Version: {sample.version ?? "N/A"}
                                        </p>
                                        <p>Type: {sample.type ?? "N/A"}</p>
                                        <p>
                                            Quality: {sample.quality ?? "N/A"}
                                        </p>
                                        <p>
                                            Format Owner:{" "}
                                            {sample.format_owner ?? "N/A"}
                                        </p>
                                        <p>
                                            Format ID:{" "}
                                            {sample.format_id ?? "N/A"}
                                        </p>
                                        <p className="break-all">
                                            Preview:{" "}
                                            {sample.data_preview || "N/A"}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
