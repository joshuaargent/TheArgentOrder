"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, Clock, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type?: 'formation' | 'campaign' | 'pod' | 'achievement' | 'system';
  action_url?: string;
}

const typeColors = {
  formation: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Formation' },
  campaign: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Campaign' },
  pod: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Pod' },
  achievement: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Achievement' },
  system: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'System' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: 'POST' });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => 
          fetch(`/api/notifications/${id}`, { method: 'DELETE' })
        )
      );
      setNotifications(notifications.filter(n => !selectedIds.has(n.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Failed to delete selected:", error);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const unread = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-purple-500" />
            </div>
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : "You're all caught up!"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-card/50">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${filter === 'unread' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Unread
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
              <Button variant="ghost" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Mark All Read */}
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-2">
          {filteredNotifications.map((n) => {
            const typeStyle = n.type ? typeColors[n.type] : typeColors.system;
            return (
              <div 
                key={n.id} 
                className={`glass-card p-4 flex items-start gap-4 group transition-all ${!n.read ? 'border-l-2 border-l-primary' : 'opacity-70'}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(n.id)}
                  className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.has(n.id) ? 'bg-primary border-primary' : 'border-border hover:border-primary'}`}
                >
                  {selectedIds.has(n.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                </button>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${typeStyle.bg} flex items-center justify-center flex-shrink-0`}>
                  {n.read ? (
                    <CheckCircle className={`h-5 w-5 ${typeStyle.text}`} />
                  ) : (
                    <Clock className={`h-5 w-5 ${typeStyle.text}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                      {n.type ? typeColors[n.type].label : 'System'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
          </h3>
          <p className="text-muted-foreground">
            {filter === 'unread' ? "You're all caught up!" : "Notifications will appear here when you receive them."}
          </p>
        </div>
      )}
    </div>
  );
}
