import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ImageUpload({ value, onChange }) {
    const [dragging, setDragging] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;

        const fileName = `${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
            .from("Image")
            .upload(fileName, file);

        if (error) {
            console.error(error);
            return;
        }

        const { data } = supabase.storage
            .from("Image")
            .getPublicUrl(fileName);

        onChange(data.publicUrl, file);
    };
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                Product Image
            </label>

            <div
                className={`relative flex flex-col items-center justify-center border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
        ${dragging ? "border-[#ff6b00] bg-[#1a0d00]" : "border-[#2a1500] bg-[#110700]"}
        `}
                onClick={() => document.getElementById("upload-input").click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files[0]);
                }}
            >
                <input
                    id="upload-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                {!value ? (
                    <>
                        <p className="text-xs text-[#664433]">
                            Drag & drop or <span className="text-[#ff6b00]">browse</span>
                        </p>
                        <p className="text-[10px] text-[#3b2a1a] mt-1">
                            PNG, JPG up to 2MB
                        </p>
                    </>
                ) : (
                    <div className="relative group">
                        <img
                            src={value}
                            alt="preview"
                            className="w-32 h-32 object-cover rounded-lg border border-[#2a1500]"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-all">
                            <span className="text-xs text-white">Change</span>
                        </div>
                    </div>
                )}
            </div>

            {value && (
                <button
                    type="button"
                    onClick={() => onChange("", null)}
                    className="text-[10px] text-[#ff0040] hover:underline w-fit"
                >
                    Remove image
                </button>
            )}
        </div>
    );
}