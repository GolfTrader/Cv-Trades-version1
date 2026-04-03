import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: "-0.5px",
          fontFamily: "Arial Black, Arial, sans-serif",
        }}
      >
        CV
      </div>
    ),
    { width: 32, height: 32 }
  );
}