import { Field } from '@prisma/client'

const CardBooking = ({
  field,
  handleBooking }: {
    field: Field & { isAvailable: boolean },
    selectedDate: string,
    handleBooking: () => void
  }) => {
  return (
    <div key={field.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 relative">
        <div className="flex justify-between items-center mb-2 absolute top-0 left-0">
          {field.isAvailable ? (
            <span className="bg-blue-900 text-white text-xs font-medium px-5 py-2">
              Available
            </span>
          ) : (
            <span className="bg-gray-400 text-gray-700 text-xs font-medium px-5 py-2">
              Booked
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4 mt-10">{field.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-orange-500">
            Rp {field.price.toLocaleString()}
          </span>
          {
            field.isAvailable && (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={handleBooking}
              >
                Select
              </button>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default CardBooking;