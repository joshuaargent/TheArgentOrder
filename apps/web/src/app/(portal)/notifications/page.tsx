"use client";
import { useEffect, useState } from "react";
import { Bell, CheckCircle, Clock } from "lucide-react";
interface Notification { id: string; title: string; message: string; read: boolean; created_at: string; }
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchNotifications(); }, []);
  const fetchNotifications = async () => { try { const res = await fetch("/api/notifications"); const data = await res.json(); setNotifications(data.notifications || []); } catch (error) { console.error("Failed:", error); } finally { setLoading(false); } };
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Bell className="h-5 w-5 text-purple-500" /></div>Notifications</h1><p className="text-muted-foreground mt-1">{unread} unread</p></div>
      {notifications.length > 0 ? notifications.map((n) => (<div key={n.id} className={`glass-card p-4 flex items-start gap-4 ${!n.read ? "border-l-2 border-l-primary" : ""}`}><div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center">{n.read ? <CheckCircle className="h-5 w-5 text-muted-foreground" /> : <Clock className="h-5 w-5 text-primary" />}</div><div className="flex-1"><p className="font-medium">{n.title}</p><p className="text-sm text-muted-foreground">{n.message}</p><p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p></div></div>)) : <div className="glass-card p-12 text-center"><Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No Notifications</h3><p className="text-muted-foreground">You're all caught up!</p></div>}
    </div>
  );
}
