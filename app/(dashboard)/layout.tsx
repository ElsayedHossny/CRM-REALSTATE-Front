"use client";

import React from "react";
import "../globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/app-sidebar";
import NavbarDash from "./NavbarDash";

import { InvoiceProvider } from "./(context)/InvoiceContext";
import { PaymentProvider } from "./(context)/payment";
import { ToastProvider } from "@/context/ToastContext";
import { NotificationProvider } from "@/context/notificationsContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <NotificationProvider>
          <ToastProvider>
            <AppSidebar />
            <main className="bg-zinc-100 flex-1 flex flex-col min-h-screen">
              <NavbarDash />
              <div className="flex-1">
                <InvoiceProvider>
                  <PaymentProvider>{children}</PaymentProvider>
                </InvoiceProvider>
              </div>
            </main>
          </ToastProvider>
        </NotificationProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
