'use client'

import { CalendarDays, CreditCard, Receipt, ClipboardEdit, CheckCircle2, Mail } from "lucide-react"

const steps = [
  {
    id: 1,
    title: 'Pilih Tanggal',
    description: 'Pilih tanggal booking',
    icon: CalendarDays,
  },
  {
    id: 2,
    title: 'Transfer',
    description: 'Transfer ke nomor rekening yang tertera',
    icon: CreditCard,
  },
  {
    id: 3,
    title: 'Bukti Transfer',
    description: 'Simpan Bukti Transfer',
    icon: Receipt,
  },
  {
    id: 4,
    title: 'Isi Form',
    description: 'Isi Form Booking dan Lampirkan Bukti Transfer',
    icon: ClipboardEdit,
  },
  {
    id: 5,
    title: 'Konfirmasi',
    description: 'Tunggu Admin Sendang Konfirmasi Bukti Transfer',
    icon: CheckCircle2,
  },
  {
    id: 6,
    title: 'Notifikasi',
    description: 'Anda Akan Diberitahu Melalui Email Jika Booking Berhasil',
    icon: Mail,
  },
]

export default function BookingSteps() {
  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Progress Line - Desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
        
        {/* Steps */}
        <div className="relative flex flex-col md:flex-row md:justify-between gap-8 md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1
            
            return (
              <div
                key={step.id}
                className="flex md:flex-col items-start md:items-center relative z-10 group"
              >
                {/* Vertical Line Connector - Mobile */}
                {!isLast && (
                  <div className="md:hidden absolute left-4 top-0 w-0.5 h-[calc(100%+2rem)] bg-gray-200 -z-10" />
                )}

                <div className="flex items-center">
                  {/* Step Number & Icon - Mobile */}
                  <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Icon Circle - Desktop */}
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-white border-2 border-blue-500 items-center justify-center mb-2 group-hover:bg-blue-50 group-hover:border-blue-600 transition-colors duration-200">
                    <Icon className="w-6 h-6 text-blue-500 group-hover:text-blue-600" />
                  </div>
                </div>
                
                <div className="flex flex-col ml-4 md:ml-0 md:items-center">
                  {/* Step Title */}
                  <h3 className="text-sm text-white font-medium mb-1 text-left md:text-center group-hover:text-blue-600">
                    {`${step.id}. ${step.title}`}
                  </h3>
                  
                  {/* Step Description */}
                  <p className="text-xs text-gray-400 text-left md:text-center md:max-w-[120px] group-hover:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 