import React from "react";

const LocatorSlipReport = React.forwardRef(
    (
        {
            name = "",
            position = "",
            station = "",
            purpose = "",
            check_type = "",
            date_time = "",
            destination = "",
        },
        ref,
    ) => {
        return (
            <div
                ref={ref}
                style={{
                    width: "794px",
                    minHeight: "1123px",
                    backgroundColor: "#fff",
                    color: "#000",
                    fontFamily: '"Times New Roman", serif',
                    fontSize: "12px",
                    padding: "20px 24px",
                    boxSizing: "border-box",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ flex: 1 }}>
                    {/* HEADER */}
                    <div
                        style={{
                            textAlign: "center",
                            lineHeight: 1.2,
                            marginBottom: "8px",
                        }}
                    >
                        <img
                            src="/img/logo.png"
                            alt="Logo"
                            style={{
                                width: "65px",
                                display: "block",
                                margin: "0 auto 4px auto",
                            }}
                        />

                        <div style={{ fontSize: "16px" }}>
                            Republic of the Philippines
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                            Department of Education
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                            REGION II – CAGAYAN VALLEY
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                            SCHOOLS DIVISION OF THE CITY OF ILAGAN
                        </div>
                    </div>

                    <div
                        style={{
                            borderTop: "1px solid black",
                            margin: "8px 0",
                        }}
                    />

                    <div
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "18px",
                            textDecoration: "underline",
                            marginBottom: "8px",
                        }}
                    >
                        LOCATOR SLIP
                    </div>

                    {/* MAIN TABLE */}
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "fixed",
                            fontSize: "14px",
                            border: "1px solid black",
                        }}
                    >
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        width: "160px",
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        fontWeight: "bold",
                                        verticalAlign: "top",
                                    }}
                                >
                                    NAME
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {name.toUpperCase()}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        fontWeight: "bold",
                                        verticalAlign: "top",
                                    }}
                                >
                                    Position/Designation
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {position}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        fontWeight: "bold",
                                        verticalAlign: "top",
                                    }}
                                >
                                    Permanent Station
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {station}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        fontWeight: "bold",
                                        verticalAlign: "top",
                                        height: "44px",
                                    }}
                                >
                                    Purpose of Travel
                                    <br />
                                    <span style={{ fontSize: "10px" }}>
                                        (must be supported by attachments)
                                    </span>
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {purpose}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        fontWeight: "bold",
                                        verticalAlign: "top",
                                    }}
                                >
                                    Please Check
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        verticalAlign: "top",
                                        fontFamily: '"Times New Roman", serif',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                        }}
                                    >
                                        {check_type === "Official Business"
                                            ? "☑"
                                            : "☐"}
                                    </span>{" "}
                                    Official Business
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "30px",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                        }}
                                    >
                                        {check_type === "Official Time"
                                            ? "☑"
                                            : "☐"}
                                    </span>{" "}
                                    Official Time
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        fontWeight: "bold",
                                        verticalAlign: "top",
                                    }}
                                >
                                    Date and Time
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {date_time}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        fontWeight: "bold",
                                        verticalAlign: "top",
                                    }}
                                >
                                    Destination
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "6px 8px",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {destination}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    colSpan={2}
                                    style={{
                                        padding: 0,
                                        border: "1px solid black",
                                    }}
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            tableLayout: "fixed",
                                        }}
                                    >
                                        <tbody>
                                            <tr>
                                                <td
                                                    style={{
                                                        width: "50%",
                                                        height: "80px",
                                                        border: "1px solid black",
                                                        textAlign: "center",
                                                        verticalAlign: "bottom",
                                                        paddingBottom: "6px",
                                                    }}
                                                >
                                                    _____________________________
                                                    <br />
                                                    Signature of Requesting
                                                    Employee
                                                </td>

                                                <td
                                                    style={{
                                                        width: "50%",
                                                        height: "80px",
                                                        border: "1px solid black",
                                                        textAlign: "center",
                                                        verticalAlign: "bottom",
                                                        paddingBottom: "6px",
                                                    }}
                                                >
                                                    _____________________________
                                                    <br />
                                                    Signature of Head of Office
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* CERTIFICATION */}
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "fixed",
                            border: "1px solid black",
                            marginTop: "14px",
                        }}
                    >
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        padding: "6px 8px",
                                    }}
                                >
                                    CERTIFICATION
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "18px 12px",
                                        verticalAlign: "top",
                                        height: "130px",
                                    }}
                                >
                                    To the concerned:
                                    <br />
                                    <br />
                                    This is to certify that the above-named
                                    DepEd official/personnel has visited or
                                    appeared in this Office/place for the
                                    purpose and during the date and time stated
                                    above.
                                    <br />
                                    <br />
                                    <br />
                                    <div
                                        style={{
                                            width: "350px",
                                            marginLeft: "auto",
                                            textAlign: "left",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        Name and Signature:
                                        <br />
                                        Position/Designation:
                                        <br />
                                        Office:
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div
                    style={{
                        marginTop: "14px",
                        borderTop: "1px solid black",
                        paddingTop: "8px",
                        fontSize: "11px",
                        fontWeight: "bold",
                    }}
                >
                    {/* TOP ROW */}
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <tbody>
                            <tr>
                                {/* LEFT: LOGOS */}
                                <td
                                    style={{
                                        width: "200px",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <div
                                        style={{ display: "flex", gap: "6px" }}
                                    >
                                        <img
                                            src="/img/deped_matatag.jpg"
                                            style={{ height: "46px" }}
                                        />
                                        <img
                                            src="/sdo-pic.jpg"
                                            style={{ height: "46px" }}
                                        />
                                    </div>
                                </td>

                                {/* RIGHT: ADDRESS + TELEPHONE */}
                                <td
                                    style={{
                                        textAlign: "right",
                                        verticalAlign: "middle",
                                        lineHeight: "1.2",
                                    }}
                                >
                                    Civic Center, Alibagu, City of Ilagan,
                                    Isabela
                                    <br />
                                    Telephone Nos. (078) 624-0077
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div
                        style={{
                            marginTop: "1px",
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            fontWeight: "normal",
                            lineHeight: "12px",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                            }}
                        >
                            <img
                                src="/img/fb_logo.png"
                                style={{
                                    height: "12px",
                                    width: "12px",
                                    verticalAlign: "middle",
                                    marginRight: "4px",
                                    display: "inline-block",
                                    top: "2px", // 👈 push down
                                }}
                                alt=""
                            />
                            <span
                                style={{
                                    verticalAlign: "middle",
                                    display: "inline-block",
                                }}
                            >
                                www.facebook.com/sdoilagan
                            </span>
                        </span>

                        <span
                            style={{ display: "inline-block", width: "8px" }}
                        />

                        <span
                            style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                            }}
                        >
                            <img
                                src="/img/gmail.png"
                                style={{
                                    height: "12px",
                                    width: "12px",
                                    verticalAlign: "middle",
                                    marginRight: "4px",
                                    display: "inline-block",
                                    top: "2px", // 👈 push downs
                                }}
                                alt=""
                            />
                            <span
                                style={{
                                    verticalAlign: "middle",
                                    display: "inline-block",
                                }}
                            >
                                ilagan@deped.gov.ph
                            </span>
                        </span>

                        <span
                            style={{ display: "inline-block", width: "8px" }}
                        />

                        <span
                            style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                            }}
                        >
                            <img
                                src="/img/internet.png"
                                style={{
                                    height: "12px",
                                    width: "12px",
                                    verticalAlign: "middle",
                                    marginRight: "4px",
                                    display: "inline-block",
                                }}
                                alt=""
                            />
                            <span
                                style={{
                                    verticalAlign: "middle",
                                    display: "inline-block",
                                }}
                            >
                                www.sdocityofilagan.gov.ph
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        );
    },
);

export default LocatorSlipReport;
