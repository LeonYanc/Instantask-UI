import "@/styles/globals.css";
import '@/styles/Login.css'
import '@/styles/UserListPage.css'
import '@/styles/ChangeUserModal.css';
import '@/styles/InviteUserModal.css';
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";

import { Josefin_Sans } from "next/font/google";
import Head from "next/head";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>InstanTask</title>
      </Head>
      <div
        className={`${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </>
  );
  // return <Component {...pageProps} />;
}
