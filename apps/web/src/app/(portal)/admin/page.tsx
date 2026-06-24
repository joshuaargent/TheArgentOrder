"use client";
import { Shield, Users, Activity } from "lucide-react";
export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><Shield className="h-5 w-5 text-red-500" /></div>Admin</h1><p className="text-muted-foreground mt-1">Manage The Argent Order</p></div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-card p-6"><div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4"><Users className="h-6 w-6 text-blue-500" /></div><h3 className="font-bold text-lg mb-2">Members</h3><p className="text-muted-foreground text-sm">Manage member accounts and roles</p></div>
        <div className="glass-card p-6"><div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4"><Activity className="h-6 w-6 text-green-500" /></div><h3 className="font-bold text-lg mb-2">Analytics</h3><p className="text-muted-foreground text-sm">View formation and engagement metrics</p></div>
        <div className="glass-card p-6"><div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4"><Shield className="h-6 w-6 text-purple-500" /></div><h3 className="font-bold text-lg mb-2">Settings</h3><p className="text-muted-foreground text-sm">Configure system settings</p></div>
      </div>
    </div>
  );
}
