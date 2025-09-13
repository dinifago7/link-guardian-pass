
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { CheckCircle, Package, Clock, Mail, ExternalLink } from 'lucide-react';

const ThankYou = () => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect to usps.com
          window.location.href = 'https://www.usps.com';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirectNow = () => {
    window.location.href = 'https://www.usps.com';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-fade-in">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Your redelivery request has been processed successfully.
            </p>
          </div>

          {/* Confirmation Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmation Number:</span>
                    <span className="font-medium">#RD{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Charged:</span>
                    <span className="font-medium">$1.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Type:</span>
                    <span className="font-medium">Priority Redelivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Delivery:</span>
                    <span className="font-medium">1-2 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Package className="w-6 h-6 text-usps-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Package Updated</h3>
              <p className="text-sm text-gray-600">
                Your delivery address has been updated in our system.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Scheduled</h3>
              <p className="text-sm text-gray-600">
                Your package will be delivered within 1-2 business days.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Confirmation Sent</h3>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to your email address.
              </p>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-usps-blue mb-3">Important Information</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-usps-blue mr-2">•</span>
                Please ensure someone is available at the delivery address during business hours (9 AM - 5 PM).
              </li>
              <li className="flex items-start">
                <span className="text-usps-blue mr-2">•</span>
                You will receive email updates about your package delivery status.
              </li>
              <li className="flex items-start">
                <span className="text-usps-blue mr-2">•</span>
                If delivery is unsuccessful again, your package will be held at the local post office for pickup.
              </li>
              <li className="flex items-start">
                <span className="text-usps-blue mr-2">•</span>
                For questions, contact USPS Customer Service at 1-800-ASK-USPS.
              </li>
            </ul>
          </div>

          {/* Redirect Notice */}
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-4">
              You will be redirected to USPS.com in {countdown} seconds
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for using USPS services. You'll be automatically redirected to our main website.
            </p>
            <button
              onClick={handleRedirectNow}
              className="usps-button inline-flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to USPS.com Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
