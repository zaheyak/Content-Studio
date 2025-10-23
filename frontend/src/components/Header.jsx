import { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header({ user, onLogin, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">
                Content Studio
              </h1>
            </div>
          </div>
          
          {user ? (
            <div className="ml-10 flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <UserCircleIcon className="h-8 w-8" />
                  <span className="hidden md:block">{user.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</div>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ml-10 space-x-4">
              <button 
                onClick={onLogin}
                className="btn-primary"
              >
                Get Started
              </button>
              <button 
                onClick={onLogin}
                className="btn-secondary"
              >
                Sign In
              </button>
            </div>
          )}
          
          <div className="ml-6 md:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="btn-secondary block w-full text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogin();
                    }}
                    className="btn-primary block w-full text-left"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogin();
                    }}
                    className="btn-secondary block w-full text-left"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


