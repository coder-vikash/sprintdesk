import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pollLatestPosts } from "../services/notificationService";
import { useNotificationStore } from "../stores/notificationStore";

const POLL_INTERVAL = 15000;

export function useNotificationsPolling(isPanelOpen: boolean) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const seenIds = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef(true);

  // explicitly track tab visibility so polling pauses/resumes as required by the spec
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);

  useEffect(() => {
    function handleVisibilityChange() {
      setIsTabVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const { data } = useQuery({
    queryKey: ["notification-poll"],
    queryFn: pollLatestPosts,
    refetchInterval: isTabVisible ? POLL_INTERVAL : false, // false = stop polling when tab hidden
  });

  useEffect(() => {
    if (!data) return;

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

      if (!isPanelOpen) {
        pushToast(`New notification: ${post.title.slice(0, 40)}...`, "info");
      }
    });
  }, [data, addNotification, pushToast, isPanelOpen]);
}
