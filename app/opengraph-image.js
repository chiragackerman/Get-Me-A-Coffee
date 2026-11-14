import { ImageResponse } from "next/og";

export const alt = "GetMeACoffee helps independent creators receive support";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #f8ecd9 0%, #efe0c9 100%)",
          color: "#3d281c",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 64,
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#fffaf2",
            border: "2px solid #d9c3a5",
            borderRadius: 36,
            display: "flex",
            height: "100%",
            justifyContent: "center",
            padding: 56,
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <svg height="84" viewBox="0 0 96 96" width="84">
              <path
                d="M20 36h48v24a15 15 0 0 1-15 15H35a15 15 0 0 1-15-15V36Zm48 8h7a10 10 0 0 1 0 20h-8"
                fill="none"
                stroke="#6f4e37"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="7"
              />
              <path
                d="M34 27c-5-7 5-8 0-15m17 15c-5-7 5-8 0-15m17 15c-5-7 5-8 0-15"
                fill="none"
                stroke="#b77c43"
                strokeLinecap="round"
                strokeWidth="5"
              />
            </svg>
            <div
              style={{
                color: "#4b3022",
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: -2,
                marginTop: 16,
              }}
            >
              GetMeACoffee
            </div>
            <div
              style={{
                color: "#6f4e37",
                fontSize: 32,
                marginTop: 12,
              }}
            >
              Support independent creators
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
