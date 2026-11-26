import { ToastContext, type ToastOptions } from '@/components/ui/toast-provider'
import { useContext, useMemo } from 'react'

/**
 * Short messages that disappear by themselves: "Saved to your photos", "Copied". Android shows its own native
 * toast, iOS an in-app banner (see ToastProvider). Use it for what went well; keep Alert for what needs an answer
 * (confirm, delete) or must be read (an error with a reason).
 *
 *   const toast = useToast()
 *   toast.success(t('export.savedBody'))
 */
export function useToast() {
  const context = useContext(ToastContext)
  const show = context?.show

  return useMemo(() => {
    const send = (options: ToastOptions) => show?.(options)
    return {
      show: send,
      success: (message: string, long?: boolean) => send({ message, kind: 'success', long }),
      error: (message: string, long?: boolean) => send({ message, kind: 'error', long }),
      info: (message: string, long?: boolean) => send({ message, kind: 'info', long }),
    }
  }, [show])
}
