import { useState, useRef } from "react";
import { Button, Card } from "../../components/ui/components";
import { supabase } from "../../../lib/supabaseClient";

interface OMIngestorProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

export function OMIngestor({ onComplete, onCancel }: OMIngestorProps) {
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file || file.type !== "application/pdf") {
            setStatus("Error: Please upload a valid PDF file.");
            return;
        }

        setLoading(true);
        setStatus("Reading PDF...");

        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64Data = e.target?.result?.toString().split(",")[1];
            if (!base64Data) {
                setStatus("Error reading file.");
                setLoading(false);
                return;
            }

            setStatus("Analyzing OM with Agent... (This usually takes 10-25s)");
            try {
                const { data, error } = await supabase.functions.invoke("om-ingestor", {
                    body: {
                        fileDataBase64: base64Data,
                        mediaType: "application/pdf"
                    }
                });

                if (error) throw error;
                if (!data || data.error) throw new Error(data?.error || "No data returned from parsing engine.");

                setStatus("Success! Parsing complete.");
                onComplete(data);
            } catch (err: any) {
                console.error("OM Ingestion failed:", err);
                setStatus(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        reader.onerror = () => {
            setStatus("Failed to read file.");
            setLoading(false);
        };

        reader.readAsDataURL(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <Card title="Intelligent OM Ingestion" action={<Button label="Cancel" onClick={onCancel} />}>
            <div style={{ padding: "0 10px 20px 10px" }}>
                <div style={{ color: "var(--c-muted)", fontSize: 13, marginBottom: 20 }}>
                    Upload an Offering Memorandum (OM) or Financial Package. Our autonomous multimodal agent will read the entire document, understand the financials, and pre-fill the key deal metrics instantly.
                </div>

                <div
                    onClick={!loading ? onClick : undefined}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={!loading ? onDrop : undefined}
                    style={{
                        border: `2px dashed ${dragging ? "var(--c-gold)" : "var(--c-border)"}`,
                        borderRadius: 8,
                        padding: 40,
                        textAlign: "center",
                        background: dragging ? "rgba(196, 160, 82, 0.05)" : "var(--c-bg2)",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".pdf"
                        onChange={onFileInput}
                        disabled={loading}
                    />

                    {loading ? (
                        <div>
                            <div className="axiom-spinner" style={{ margin: "0 auto 16px auto", width: 24, height: 24, borderTopColor: "var(--c-gold)", borderRightColor: "transparent", borderBottomColor: "transparent", borderLeftColor: "transparent", borderWidth: 2, borderStyle: "solid", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                            <div style={{ color: "var(--c-gold)", fontWeight: 600 }}>{status}</div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: 32, marginBottom: 16 }}>📄</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--c-text)", marginBottom: 8 }}>
                                Drag & Drop your PDF here
                            </div>
                            <div style={{ fontSize: 12, color: "var(--c-dim)" }}>
                                or click to browse
                            </div>
                        </div>
                    )}
                </div>

                {!loading && status && (
                    <div style={{ marginTop: 16, fontSize: 13, color: status.startsWith("Error") ? "var(--c-red)" : "var(--c-green)", textAlign: "center" }}>
                        {status}
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}} />
        </Card>
    );
}
