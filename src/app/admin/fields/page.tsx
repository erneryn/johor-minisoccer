'use client'
import {  Modal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow  } from "flowbite-react";

import { useEffect, useState } from "react";

interface FieldFormData {
  name: string;
  description: string;
  price: number;
  type: 'regular' | 'weekend' | 'promo';
  startDate?: string;
  endDate?: string;
  weekendPrice?: number;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  weekendPrice?: string;
}

interface Field {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  startDate: string | null;
  endDate: string | null;
  weekendPrice: number | null;
}

const FieldModal = ({open, setOpen, onFieldAdded}: {open: boolean, setOpen: (open: boolean) => void, onFieldAdded: () => void}) => {
    const [formData, setFormData] = useState<FieldFormData>({
      name: '',
      description: '',
      price: 0,
      type: 'regular',
      startDate: '',
      endDate: '',
      weekendPrice: 0
    });

    useEffect(() => {
      if (open) {
        setFormData({
          name: '',
          description: '',
          price: 0,
          type: 'regular',
          startDate: '',
          endDate: '',
          weekendPrice: 0
        });
      }
    }, [open]);

    const [errors, setErrors] = useState<FormErrors>({});


    const validateForm = (): boolean => {
      const newErrors: FormErrors = {};

      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Field name is required';
      }

      // Description validation
      if (!formData.description) {
        newErrors.description = 'Please select a time slot';
      }

      // Price validation
      if (!formData.price || formData.price <= 0) {
        newErrors.price = 'Price must be greater than 0';
      }

      // Type validation
      if (!formData.type) {
        newErrors.type = 'Please select a type';
      }

      // Promo date validation
      if (formData.type === 'promo') {
        if (!formData.startDate) {
          newErrors.startDate = 'Start date is required for promo fields';
        }
        if (!formData.endDate) {
          newErrors.endDate = 'End date is required for promo fields';
        }
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        if (formData.weekendPrice && formData.weekendPrice <= 0) {
          newErrors.weekendPrice = 'Weekend price must be greater than 0';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      // Clear error when user starts typing
      if (errors[id as keyof FormErrors]) {
        setErrors(prev => ({
          ...prev,
          [id]: undefined
        }));
      }
    };

    const handleAddField = async () => {
      if (validateForm()) {
        try {
          const response = await fetch('/api/fields', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          
          if (!response.ok) {
            throw new Error('Failed to create field');
          }
          
          const data = await response.json();
          console.log('Response:', data);
          setOpen(false);
          onFieldAdded(); // Refresh the fields list
        } catch (error) {
          console.error('Error creating field:', error);
        }
      }
    }

    return (
        <div>
          <Modal show={open} onClose={() => setOpen(false)} className="container mx-auto px-4 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-12">
            <ModalHeader className="p-3">Add New Field</ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 block">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nama Lapangan</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Pagi 1"
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                </div>
                <div>
                  <div className="mb-2 block">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Jam</label>
                    <select
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select time</option>
                      <option value="06:00 - 08:00">06:00 - 08:00</option>
                      <option value="08:00 - 10:00">08:00 - 10:00</option>
                      <option value="10:00 - 12:00">10:00 - 12:00</option>
                      <option value="12:00 - 14:00">12:00 - 14:00</option>
                      <option value="14:00 - 16:00">14:00 - 16:00</option>
                      <option value="16:00 - 18:00">16:00 - 18:00</option>
                      <option value="18:00 - 20:00">18:00 - 20:00</option>
                      <option value="20:00 - 22:00">20:00 - 22:00</option>
                      <option value="22:00 - 00:00">22:00 - 00:00</option>
                    </select>
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>
                </div>
                <div>
                  <div className="mb-2 block">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Price</label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border ${errors.price ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="Enter price"
                      required
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                  </div>
                </div>
                <div>
                  <div className="mb-2 block">
                    <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">Type</label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="regular">Regular</option>
                      <option value="weekend">Weekend</option>
                      <option value="promo">Promo</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                  </div>
                </div>
                {formData.type === 'promo' && (
                  <>
                    <div>
                      <div className="mb-2 block">
                        <label htmlFor="weekendPrice" className="block mb-2 text-sm font-medium text-gray-900">Weekend Price</label>
                        <input
                          type="number"
                          id="weekendPrice"
                          value={formData.weekendPrice}
                          onChange={handleInputChange}
                          className={`bg-gray-50 border ${errors.weekendPrice ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                          required
                        />
                        {errors.weekendPrice && <p className="mt-1 text-sm text-red-500">{errors.weekendPrice}</p>}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
                        <input
                          type="date"
                          id="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className={`bg-gray-50 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                          required
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
                        <input
                          type="date" 
                          id="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className={`bg-gray-50 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                          required
                        />
                        {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <button onClick={handleAddField} className="bg-orange-500 text-white px-4 py-2 rounded-md">Add Field</button>
            </ModalFooter>
          </Modal>
        </div>
      );
};

export default function FieldsPage() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);

  const fetchFields = async () => {
    try {
      const response = await fetch('/api/fields');
      if (!response.ok) {
        throw new Error('Failed to fetch fields');
      }
      const data = await response.json();
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 sm:w-4/5 space-y-8 py-12 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500">Fields Management</h1>
        <button onClick={() => setOpen(true)} className="bg-orange-500 text-white px-4 py-2 rounded-md">
          Add New Field
        </button>
      </div>

      <FieldModal open={open} setOpen={setOpen} onFieldAdded={fetchFields} />

      <div className="overflow-x-auto">
        <Table hoverable className="[&>tbody>tr:hover]:bg-orange-50">
          <TableHead>
            <TableRow>
              <TableHeadCell>Nama</TableHeadCell>
              <TableHeadCell>Jam Main</TableHeadCell>
              <TableHeadCell>Harga</TableHeadCell>
              <TableHeadCell>Harga Weekend</TableHeadCell>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Tanggal Start</TableHeadCell>
              <TableHeadCell>Tanggal Akhir</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.description}</TableCell>
                <TableCell className="text-xs w-1/6">Rp {field.price.toLocaleString()}</TableCell>
                <TableCell className="text-xs w-1/6">Rp {field.weekendPrice ? field.weekendPrice.toLocaleString() : '-'}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>{field.startDate ? field.startDate.slice(0, 10) : '-'}</TableCell>
                <TableCell>{field.endDate ? field.endDate.slice(0, 10) : '-'}</TableCell>
                <TableCell>
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};