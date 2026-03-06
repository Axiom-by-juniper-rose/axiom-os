import React, { useRef } from 'react';
import { S } from '../../constants';
import { importCSV } from '../../utils';

export function CSVImportButton({ onImport }) {
    const fileRef = useRef(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importCSV(file, (data) => {
                onImport(data);
                e.target.value = '';
            });
        }
    };
    return (
        <>
            <input type="file" ref={fileRef} style={{ display: "none" }} accept=".csv" onChange={handleFileChange} />
            <button style={{ ...S.btn(), padding: "4px 10px", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }} onClick={() => fileRef.current?.click()}>
                <span>📥</span> Import CSV
            </button>
        </>
    );
}
