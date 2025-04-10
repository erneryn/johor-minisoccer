import { Field } from '@prisma/client'

interface CardBookingProps {
  field: Field & { isAvailable: boolean },
  handleBooking: (fieldId: string) => void,
  isHoliday: boolean,
  isWeekend: boolean
}

interface TagProps {
  field: Field & { isAvailable: boolean, type: string },
  isHoliday: boolean,
  isWeekend: boolean
}

const CardBooking = ({
  field,
  isHoliday,
  isWeekend,
  handleBooking
}: CardBookingProps) => {
  console.log(isHoliday,isWeekend)
  const Tag = ({field, isHoliday, isWeekend}: TagProps) => {

    if(field.isAvailable) {
      return (
        <div className="flex">
          <span className="bg-blue-900 text-white text-xs font-medium px-5 py-2">
            Available
          </span>
          {
            isHoliday ? (
              <span className="bg-red-500 text-white text-xs font-medium px-5 py-2">
                Hari Libur
              </span>
            ) : (
              isWeekend ? (
                <span className="bg-red-500 text-white text-xs font-medium px-5 py-2">
                  Weekend
                </span>
              ) : (
                <span className="bg-gray-400 text-white text-xs font-medium px-5 py-2">
                  Weekday
                </span>
              )
            )
          }
        </div>
      );
    } else {
      return <span className="bg-gray-400 text-gray-700 text-xs font-medium px-5 py-2">
      Booked
    </span>
    }
  }
  return (
    <div key={field.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 relative">
        <div className="flex justify-between items-center mb-2 absolute top-0 left-0">
         <Tag field={field} isHoliday={isHoliday} isWeekend={isWeekend}/>
        </div>
        <p className="text-gray-600 mb-1 mt-10">{field.description}</p>
        {
          field.type === 'promo' && (
            <span className="bg-yellow-500 border border-yellow-500 rounded-full text-white text-xs font-medium px-5 py-1">
                  Promo
                </span>
          )
        }
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-orange-500">
            Rp {field.price.toLocaleString()}

          </span>
          {
            field.isAvailable && (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={() => handleBooking(field.id)}
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