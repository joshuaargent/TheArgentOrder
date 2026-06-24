"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon, Bell, Shield, User, Lock, Palette } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Appearance
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Choose how The Argent Order looks to you</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={"p-4 rounded-xl border-2 transition-all " + (theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
          >
            <Sun className={"h-6 w-6 mx-auto mb-2 " + (theme === "light" ? "text-primary" : "text-muted-foreground")} />
            <span className={"text-sm font-medium " + (theme === "light" ? "text-primary" : "")}>Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={"p-4 rounded-xl border-2 transition-all " + (theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
          >
            <Moon className={"h-6 w-6 mx-auto mb-2 " + (theme === "dark" ? "text-primary" : "text-muted-foreground")} />
            <span className={"text-sm font-medium " + (theme === "dark" ? "text-primary" : "")}>Dark</span>
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Choose what notifications you receive</p>
        
        <div className="space-y-4">
          {[
            { label: "Formation Reminders", desc: "Daily reminders to complete your rule" },
            { label: "Campaign Updates", desc: "Progress and milestone notifications" },
            { label: "Brotherhood", desc: "Pod meeting and prayer requests" },
            { label: "Achievements", desc: "Unlock and milestone notifications" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-background/50">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Account
        </h2>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start border-border/50">
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start border-border/50">
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="glass-card p-6 border border-destructive/30">
        <h2 className="text-lg font-bold mb-2 text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">Irreversible actions</p>
        <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
