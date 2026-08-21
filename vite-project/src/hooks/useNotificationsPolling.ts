import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { pollLatestPosts } from "../services/notificationService";
import { useNotificationStore } from "../stores/notificationStore";

const POLL_INTERVAL = 15000; // 15 seconds

export function useNotificationsPolling(isPanelOpen: boolean) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const seenIds = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef(true);

  const { data } = useQuery({
    queryKey: ["notification-poll"],
    queryFn: pollLatestPosts,
    refetchInterval: POLL_INTERVAL,
    // tanstack query already skips refetching while the tab is hidden by default
  });

  useEffect(() => {
    if (!data) return;

    // first time data loads, just record the ids as "already seen" - don't spam notifications
    if (isFirstLoad.current) {
      data.forEach((post) => seenIds.current.add(post.id));
      isFirstLoad.current = false;
      return;
    }

    const newPosts = data.filter((post) => !seenIds.current.has(post.id));

    newPosts.forEach((post) => {
      seenIds.current.add(post.id);

      addNotification({
        id: post.id,
        title: "New update",
        message: post.title,
        type: "task",
        read: false,
        createdAt: new Date().toISOString(),
      });

      // only toast if the person isn't already looking at the panel
      if (!isPanelOpen) {
        pushToast(`New notification: ${post.title.slice(0, 40)}...`, "info");
      }
    });
  }, [data, addNotification, pushToast, isPanelOpen]);
}
