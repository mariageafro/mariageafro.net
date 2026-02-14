import { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/use-notifications";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface NotificationBellProps {
  showSolid: boolean;
}

export function NotificationBell({ showSolid }: NotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (notif: { id: string; action_url: string | null; is_read: boolean }) => {
    if (!notif.is_read) markAsRead(notif.id);
    if (notif.action_url) navigate(notif.action_url);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-full transition-colors ${
          showSolid ? "text-chocolate hover:bg-champagne/10" : "text-ivory hover:bg-white/10"
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <h3 className="font-serif text-sm text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="font-body text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    <CheckCheck size={10} /> Tout marquer lu
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={24} className="text-muted-foreground mx-auto mb-2" />
                    <p className="font-body text-sm text-muted-foreground">Aucune notification</p>
                    <p className="font-body text-[10px] text-muted-foreground mt-1">
                      Les rappels pour vos étapes culturelles apparaîtront ici
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleClick(notif)}
                      className={`w-full text-left px-4 py-3 border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors ${
                        !notif.is_read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0 mt-0.5">{notif.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-body text-xs truncate ${!notif.is_read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                              {notif.title}
                            </p>
                            {!notif.is_read && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="font-body text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="font-body text-[9px] text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
