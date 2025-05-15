// src/components/VerifyResetToken.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyResetToken = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('Verifying reset token...');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setMessage('Invalid or missing reset token');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/verify-reset-token?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsValid(true);
          setMessage('Token verified successfully');
          // Redirect to reset password form with token
          navigate(`/reset-password?token=${token}`);
        } else {
          setIsValid(false);
          setMessage(data.message || 'Invalid or expired reset token');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setIsValid(false);
        setMessage('An error occurred while verifying the token');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Password Reset</h2>
        
        <div className={`p-4 rounded-md ${isVerifying ? 'bg-blue-100 text-blue-700' : isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <p className="text-center">
            {isVerifying ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                {message}
              </>
            ) : (
              message
            )}
          </p>
        </div>
        
        {!isVerifying && !isValid && (
          <div className="mt-6 text-center">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Request a new password reset
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyResetToken;