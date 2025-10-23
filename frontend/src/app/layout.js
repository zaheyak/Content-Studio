import './globals.css';

export const metadata = {
  title: 'Content Studio',
  description: 'A web-based microservice for content creation and management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}

