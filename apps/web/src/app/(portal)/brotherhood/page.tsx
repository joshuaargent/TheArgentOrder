"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Calendar, MessageSquare, Clock } from "lucide-react";

interface PodMember {
  user_id: string;
  joined_at: string;
  profiles: {
    display_name: string;
    avatar_url: string;
    email: string;
  };
}

interface Meeting {
  id: string;
  scheduled_at: string;
  notes: string;
}

export default function BrotherhoodPage() {
  const [pod, setPod] = useState<any>(null);
  const [members, setMembers] = useState<PodMember[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrotherhood();
  }, []);

  const fetchBrotherhood = async () => {
    try {
      const res = await fetch("/api/pods");
      const data = await res.json();
      setPod(data.pod);
      setMembers(data.members || []);
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error("Failed to fetch brotherhood:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!pod) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Brotherhood</h1>
          <p className="text-muted-foreground">Accountability and community</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">You&apos;re not in a Pod yet</h3>
            <p className="text-muted-foreground mb-4">
              Pods are small groups of brothers who hold each other accountable.
            </p>
            <Button>Find a Pod</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brotherhood</h1>
        <p className="text-muted-foreground">Your Pod: {pod.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pod Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {pod.name}
            </CardTitle>
            {pod.description && (
              <CardDescription>{pod.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{members.length} member{members.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meetings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming meetings</p>
            ) : (
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {formatDate(meeting.scheduled_at)}
                      </span>
                    </div>
                    {meeting.notes && (
                      <p className="text-sm text-muted-foreground ml-6">
                        {meeting.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pod Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pod Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div key={member.user_id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {member.profiles?.display_name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {member.profiles?.display_name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Pod Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Send Prayer Request</Button>
            <Button variant="outline">Share a Win</Button>
            <Button variant="outline">Schedule Meeting</Button>
            <Button variant="outline">View Pod Goals</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
