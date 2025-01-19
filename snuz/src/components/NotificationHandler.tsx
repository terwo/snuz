import React, { useEffect, useRef } from "react";
import { scheduleAlarm } from "../utils/notificationConfig";

const CountdownNotificationHandler = ({ countdown }) => {
  const notificationSent = useRef(false);

  useEffect(() => {
    const handleCountdownNotification = async () => {
      // Send notification at 5 seconds
      if (countdown <= 5 && countdown > 0 && !notificationSent.current) {
        await scheduleAlarm(new Date(Date.now())); // Immediate notification
        notificationSent.current = true;
        console.log("Notification sent!");
      }

      // Reset the flag when countdown goes above 5
      if (countdown > 5) {
        notificationSent.current = false;
      }
    };

    handleCountdownNotification();
  }, [countdown]);

  return null;
};

export default CountdownNotificationHandler;
