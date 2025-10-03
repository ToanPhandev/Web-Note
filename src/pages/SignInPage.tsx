import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/login-form';

export default function SignInPage() {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">Vui lòng nhập thông tin để đăng nhập</p>
          <LoginForm />
          <div className="mt-4">
            <Link to="/Welcome" className="text-blue-500 hover:underline">
              &larr; Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }