import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Video variants – mirrors the paths previously hard-coded in Home1.tsx.
// ---------------------------------------------------------------------------
const VIDEO_VARIANTS = {
  dark: {
    mobileHD: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4",
    mobileCompressed: "/video/1659171_Trapcode_Particles_3840x2160.mp4",
    desktopHD: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark+1080.mp4",
    desktopCompressed: "/video/1659171_Trapcode_Particles_3840x2160.mp4",
  },
  light: {
    mobileHD: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4",
    mobileCompressed: "/video/0_Flutter_Wind_3840x2160.mp4",
    desktopHD: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white1.mp4",
    desktopCompressed: "/video/0_Flutter_Wind_3840x2160.mp4",
  },
} as const;

type ThemeKey = keyof typeof VIDEO_VARIANTS;

/**
 * Very small UA check for mobile detection.
 */
const isMobileUA = (ua: string): boolean => {
  return /mobile|android|iphone|ipad|ipod|iemobile|opera mini/i.test(ua);
};

export async function GET(req: NextRequest) {
  // Grab headers early for reuse
  const headers = req.headers;
  // Override theme via query parameter if provided
  const reqUrl = new URL(req.url);
  const qTheme = reqUrl.searchParams.get('theme');
  let validTheme: ThemeKey;
  if (qTheme === 'dark' || qTheme === 'light') {
    validTheme = qTheme;
  } else {
    // --------------- Theme (dark / light) -----------------
    const chColorScheme = headers.get("sec-ch-prefers-color-scheme");
    const cookieThemeMatch = headers.get("cookie")?.match(/theme=(dark|light)/i);
    const headerTheme = (chColorScheme ?? cookieThemeMatch?.[1] ?? "light").toLowerCase() as ThemeKey;
    validTheme = headerTheme === "dark" || headerTheme === "light" ? headerTheme : "light";
  }

  // --------------- Device class (mobile / desktop) ------
  const ua = headers.get("user-agent") ?? "";
  const isMobile = isMobileUA(ua);

  // --------------- Connection quality -------------------
  const saveData = headers.get("save-data") === "on";
  const ect = headers.get("ect") || headers.get("x-effective-connection-type") || "";
  const slowConn = saveData || ["2g", "slow-2g", "3g"].includes(ect.toLowerCase());

  // --------------- Pick variant -------------------------
  const variantObj = VIDEO_VARIANTS[validTheme];
  const videoUrl = isMobile
    ? slowConn
      ? variantObj.mobileCompressed
      : variantObj.mobileHD
    : slowConn
    ? variantObj.desktopCompressed
    : variantObj.desktopHD;

  // --------------- Cache headers ------------------------
  const res = NextResponse.redirect(videoUrl, 302);
  res.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  return res;
} 