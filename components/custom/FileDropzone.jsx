import React, { useState, useCallback } from "react";
import { Upload } from "lucide-react";

/**
 * FileDropzone (generic)
 * Props:
 *  - onAdd(filesMeta: {id:string, file:File, name:string, size:number, type:string, extension:string}[]) => void
 *  - accept: string (input accept attribute, e.g. '.pdf,.doc,.docx,application/pdf')
 *  - maxSizeMB?: number (reject files larger than this)
 *  - label?: string
 *  - className?: string
 *  - multiple?: boolean (default true)
 */
const FileDropzone = ({
    onAdd,
    accept = ".png,.pdf,.doc,.docx,application/pdf",
    maxSizeMB = 10,
    label = "ارفع الملف هنا",
    className = "",
    multiple = true,
    Icon = Upload,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    const addFiles = useCallback(
        (fileList) => {
            const files = Array.from(fileList);
            if (!files.length) return;

            const filtered = files.filter((f) => {
                if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) {
                    setError(`أقصى حجم ${maxSizeMB}MB : ${f.name}`);
                    return false;
                }
                if (accept) {
                    // accept can contain extensions or mime types separated by commas
                    const tokens = accept
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                    const ok = tokens.some((t) => {
                        if (t.startsWith("."))
                            return f.name
                                .toLowerCase()
                                .endsWith(t.toLowerCase());
                        if (t.endsWith("/*"))
                            return f.type.startsWith(t.slice(0, -1));
                        return f.type === t;
                    });
                    if (!ok) {
                        setError(`نوع ملف غير مسموح: ${f.name}`);
                        return false;
                    }
                }
                return true;
            });

            if (!filtered.length) return;
            setError(null);

            const meta = filtered.map((file, i) => {
                const parts = file.name.split(".");
                const extension = parts.length > 1 ? parts.pop() : "";
                return {
                    id: `${Date.now()}-${i}`,
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    extension,
                };
            });
            onAdd && onAdd(meta);
        },
        [onAdd, accept, maxSizeMB]
    );

    const handleInputChange = (e) => {
        addFiles(e.target.files);
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    };

    return (
        <div className="space-y-2">
            <label
                className={`border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 cursor-pointer transition-colors hover:border-primary-600 hover:bg-primary-50 ${
                    isDragging
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-300"
                } ${className}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Icon className="mb-1" size={28} />
                <div className="text-sm select-none">{label}</div>
                <input
                    type="file"
                    accept={accept || undefined}
                    multiple={multiple}
                    onChange={handleInputChange}
                    className="hidden"
                />
            </label>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default FileDropzone;
