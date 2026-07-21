import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { emailLogService, type EmailLog } from '../services/emailLogService';

const TYPE_LABELS: Record<EmailLog['type'], string> = {
  buyer_confirmation: 'Buyer Confirmation',
  vendor_notification: 'Vendor Notification',
};

function formatTimestamp(ts: EmailLog['timestamp']): string {
  if (!ts) return '—';
  const date = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

interface Props {
  orderId: string;
}

export default function EmailActivitySection({ orderId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleToggle = async () => {
    setExpanded(prev => !prev);
    if (!loaded) {
      setLoading(true);
      const data = await emailLogService.getByOrderId(orderId);
      setLogs(data);
      setLoaded(true);
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <Mail size={14} />
        Email Activity
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-3">
          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-xs py-2">
              <Loader2 size={12} className="animate-spin" />
              Loading email logs...
            </div>
          )}

          {!loading && logs.length === 0 && (
            <p className="text-gray-600 text-xs py-2">
              No email logs found for this order. Emails are logged after the next purchase.
            </p>
          )}

          {!loading && logs.length > 0 && (
            <div className="space-y-2">
              {logs.map(log => (
                <div
                  key={log.id}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2 text-xs ${
                    log.status === 'sent'
                      ? 'bg-green-900/15 border border-green-700/20'
                      : 'bg-red-900/15 border border-red-700/20'
                  }`}
                >
                  {log.status === 'sent' ? (
                    <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-200">{TYPE_LABELS[log.type]}</span>
                      <span className="text-gray-500 shrink-0">{formatTimestamp(log.timestamp)}</span>
                    </div>
                    <p className="text-gray-400 truncate">To: {log.to}</p>
                    {log.status === 'failed' && log.error && (
                      <p className="text-red-400 mt-0.5 break-words">{log.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
