import "./globals.css";
import Provider from "../components/mis/Providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { constructMetadata } from "@/lib/utils";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextStep, NextStepProvider, Tour } from "nextstepjs";
import {
  onNextStepComplete,
  onNextStepSkip,
} from "@/components/nextstep/callback";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
export const metadata = constructMetadata({
  title: "UsePdfAi - the Saas for everyone",
  description: "Get instant answers from your PDFs with AI-driven chat.",
  image: "./",
  icons: "./favicon.ico",
  noIndex: false,
});
const steps: Tour[] = [
  {
    tour: "firstTour",
    steps: [
      {
        icon: "👋",
        title: "Welcome",
        content: "Let's get started with Use PDF Ai",
        // selector: "",body
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: "👋",
        title: "Conversations",
        content: "This is where you create your chats",
        selector: "#conversations",
        side: "top",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "New Chat",
        content: "Click here to create a new chat",
        selector: "#newchatbtn",
        side: "bottom-right",

        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "All of your chats are here.",
        content: "You can search and paginate your chats.",
        selector: "#listofallchats",
        side: "left-bottom",
        showControls: true,
        showSkip: true,
        nextRoute: "/dashboard/documents",
      },
      {
        icon: "👋",
        title: "Documents page",
        content: "All of your documents and folders live here",
        selector: "#docspage",
        side: "bottom",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "Create Folders and Upload your documents",
        content: "",
        selector: "#firstTour-6",
        side: "bottom",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "Your account and billing details are here",
        content: "Feel free to look around",
        selector: "#firstTour-5",
        side: "top-left",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "⚡ ",
        title: "Have a great day ahead ",
        content: "Upload your first document and create your first chat!",

        showControls: true,
        showSkip: true,
      },
    ],
  },
  {
    tour: "secondTour",
    steps: [
      {
        icon: "👋",
        title: "Welcome",
        content: "Let's get chatting with your PDFs",
        // selector: "#step1",
        side: "bottom",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "PDF",
        content: "This is your PDF",
        selector: "#secondtour-1",
        side: "right",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "PDF",
        content: "You can flip through it by using this tool",
        selector: "#secondtour-2",
        side: "bottom-left",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "Additional Tools",
        content: "Use these to zoom in and rotate your PDF",
        selector: "#secondtour-3",
        side: "bottom-left",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "Title",
        content:
          "You can rename your workspace. Click on it and enter your desired name",
        selector: "#secondtour-4",
        side: "bottom-left",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "PDF",
        content: "You can select the PDF you wish to view. Just click on it",
        selector: "#secondtour-5",
        side: "left",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "Icon Colour",
        content: "Each PDF has a colour linked to it for reference.",
        selector: "#secondtour-6",
        side: "left-top",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "Export",
        content: "Download a JSON file of your chat history",
        selector: "#secondtour-7",
        side: "bottom-right",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👋",
        title: "Start Chatting",
        content: "Enter any question about your PDFs to get started",
        selector: "#secondtour-8",
        side: "bottom-right",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "⚡ ",
        title: "Have a great day ahead ",
        content: "Wonderful things are in store",

        showControls: true,
        showSkip: true,
      },
      // More steps...
    ],
  },
];

//meta tags
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable}`} lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-THQ97RB5" />
      <head>
        <ColorSchemeScript />
      </head>
      <body className={` antialiased bg-[#ECFAFF]`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-THQ97RB5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <MantineProvider>
          <Provider>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <NextStepProvider>
              <NextStep
                steps={steps}
                onSkip={onNextStepSkip}
                onComplete={onNextStepComplete}
              >
                {children}
              </NextStep>
            </NextStepProvider>
          </Provider>
        </MantineProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
