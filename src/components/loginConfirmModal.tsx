import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  primaryButton?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive'
  }
  secondaryButton?: {
    label: string
    onClick: () => void
  }
}

export function LoginConfirmModal({
  isOpen,
  onClose,
  title,
  children,
  primaryButton,
  secondaryButton
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-end gap-2 p-4 border-t dark:border-gray-700">
          {secondaryButton && (
            <button
              onClick={secondaryButton.onClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {secondaryButton.label}
            </button>
          )}
          {primaryButton && (
            <button
              onClick={primaryButton.onClick}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                primaryButton.variant === 'destructive'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {primaryButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 